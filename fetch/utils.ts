/**
 * Base utilities for WordPress REST API fetching
 */

const WORDPRESS_API_BASE = "https://ecstaticdance.nl/wp/wp-json/wp/v2";

// Limit concurrent requests to avoid hammering the WordPress host
const MAX_CONCURRENT_REQUESTS = 4;
let activeRequests = 0;
const requestQueue: Array<() => void> = [];

const waitForTurn = async () => {
  if (activeRequests < MAX_CONCURRENT_REQUESTS) {
    activeRequests += 1;
    return;
  }

  await new Promise<void>((resolve) => {
    requestQueue.push(() => {
      activeRequests += 1;
      resolve();
    });
  });
};

const releaseTurn = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  const next = requestQueue.shift();
  if (next) next();
};

const smartDelay = (attempt: number) => {
  // Small exponential backoff with jitter, capped at ~2s
  const base = 300 * Math.pow(2, attempt - 1);
  const jitter = Math.floor(Math.random() * 200);
  const ms = Math.min(2000, base + jitter);
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
};

export interface FetchOptions {
  per_page?: number;
  orderby?: string;
  order?: "asc" | "desc";
  _embed?: boolean;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Generic fetch wrapper for WordPress REST API
 */
export async function fetchWordPressAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T[]> {
  const params = new URLSearchParams();
  
  // Set default options
  const defaultOptions: FetchOptions = {
    _embed: true,
    ...options,
  };

  // Add all options as query parameters
  Object.entries(defaultOptions).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const url = `${WORDPRESS_API_BASE}/${endpoint}?${params.toString()}`;

  // #region agent log
  console.log("[DEBUG] Fetching WordPress API:", { endpoint, url, options });
  fetch(
    "http://127.0.0.1:7243/ingest/627c74f3-637b-4fb3-b079-325ab5beb31b",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "fetch/utils.ts:35",
        message: "Fetching WordPress API",
        data: { endpoint, url, options },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }
  ).catch(() => {});
  // #endregion

  await waitForTurn();

  try {
    let lastError: unknown;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // #region agent log
      console.log("[DEBUG] WordPress API response:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
      });
      fetch(
        "http://127.0.0.1:7243/ingest/627c74f3-637b-4fb3-b079-325ab5beb31b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "fetch/utils.ts:45",
            message: "WordPress API response",
            data: {
              status: response.status,
              statusText: response.statusText,
              url: response.url,
              headers: Object.fromEntries(response.headers.entries()),
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "C",
          }),
        }
      ).catch(() => {});
      // #endregion

      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
      }

      // Retry on transient / resource-limit style errors
      const shouldRetry =
        response.status === 429 ||
        response.status === 508 ||
        (response.status >= 500 && response.status < 600);

      // #region agent log
      let errorText = "Unable to read error response";
      try {
        const clonedResponse = response.clone();
        errorText = await clonedResponse
          .text()
          .catch(() => "Unable to read error response");
      } catch {
        // Ignore clone errors
      }
      console.log("[DEBUG] WordPress API error details:", {
        status: response.status,
        statusText: response.statusText,
        requestUrl: url,
        responseUrl: response.url,
        errorText: errorText.substring(0, 500),
        attempt,
        willRetry: shouldRetry && attempt < 3,
      });
      fetch(
        "http://127.0.0.1:7243/ingest/627c74f3-637b-4fb3-b079-325ab5beb31b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "fetch/utils.ts:61",
            message: "WordPress API error",
            data: {
              status: response.status,
              statusText: response.statusText,
              requestUrl: url,
              responseUrl: response.url,
              errorText: errorText.substring(0, 500),
              attempt,
              willRetry: shouldRetry && attempt < 3,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "D",
          }),
        }
      ).catch(() => {});
      // #endregion

      lastError = new Error(
        `WordPress API error: ${response.status} ${response.statusText} ${url}`
      );

      if (!shouldRetry || attempt === 3) {
        throw lastError;
      }

      await smartDelay(attempt);
    }

    // Should be unreachable, but keeps TypeScript happy
    throw lastError ?? new Error("Unknown WordPress API error");
  } catch (error) {
    console.error(`Error fetching from WordPress API (${endpoint}):`, error);
    throw error;
  } finally {
    releaseTurn();
  }
}

/**
 * Transform WordPress REST API post to match GraphQL structure
 */
export function transformFeaturedImage(
  post: { _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> } }
): { node: { sourceUrl: string } } | null {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!featuredMedia?.source_url) {
    return null;
  }
  return {
    node: {
      sourceUrl: featuredMedia.source_url,
    },
  };
}
