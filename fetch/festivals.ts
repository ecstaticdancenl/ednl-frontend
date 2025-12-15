/**
 * Fetch functions for WordPress Festivals/Retraites custom post type
 */

import {
  fetchWordPressAPI,
  transformFeaturedImage,
  FetchOptions,
} from "./utils";
import {
  WordPressPostWithACF,
  ACFEventInfo,
  ACFEventInfoRaw,
  TransformedFestivalRetraite,
  FestivalsRetraitesResponse,
} from "./types";

/**
 * Fetch all festivals and retraites from WordPress REST API
 */
export async function fetchFestivalsRetraites(
  options: FetchOptions = {}
): Promise<FestivalsRetraitesResponse> {
  const defaultOptions: FetchOptions = {
    per_page: 100, // WordPress REST API maximum
    _embed: true,
    ...options,
  };

  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/627c74f3-637b-4fb3-b079-325ab5beb31b", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "fetch/festivals.ts:29",
      message: "Fetching festivals from WordPress API",
      data: { endpoint: "festival-of-retraite", options: defaultOptions },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion

  const posts = await fetchWordPressAPI<WordPressPostWithACF<ACFEventInfoRaw>>(
    "festival-of-retraite",
    defaultOptions
  );

  // #region agent log
  console.log("[DEBUG] Received posts from WordPress API:", {
    postCount: posts.length,
    firstPostAcfKeys: posts[0]?.acf ? Object.keys(posts[0].acf) : null,
    firstPostAcfSample: posts[0]?.acf
      ? JSON.stringify(posts[0].acf).substring(0, 200)
      : null,
  });
  fetch("http://127.0.0.1:7243/ingest/627c74f3-637b-4fb3-b079-325ab5beb31b", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "fetch/festivals.ts:35",
      message: "Received posts from WordPress API",
      data: {
        postCount: posts.length,
        firstPostAcf: posts[0]?.acf ? Object.keys(posts[0].acf) : null,
        firstPostAcfSample: posts[0]?.acf
          ? JSON.stringify(posts[0].acf).substring(0, 200)
          : null,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion

  const nodes: TransformedFestivalRetraite[] = posts.map((post) => {
    const featuredImage = transformFeaturedImage(post);

    // #region agent log
    console.log("[DEBUG] Processing post ACF fields:", {
      postId: post.id,
      postSlug: post.slug,
      acfKeys: post.acf ? Object.keys(post.acf) : [],
      soortEventRaw: post.acf?.soort_event,
      fullAcf: JSON.stringify(post.acf).substring(0, 300),
    });
    fetch("http://127.0.0.1:7243/ingest/627c74f3-637b-4fb3-b079-325ab5beb31b", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "fetch/festivals.ts:45",
        message: "Processing post ACF fields",
        data: {
          postId: post.id,
          postSlug: post.slug,
          acfKeys: post.acf ? Object.keys(post.acf) : [],
          soortEventRaw: post.acf?.soort_event,
          fullAcf: JSON.stringify(post.acf).substring(0, 300),
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion

    // Transform snake_case ACF fields to camelCase for component usage
    const acf = post.acf || ({} as ACFEventInfoRaw);
    const eventInfo: ACFEventInfo = {
      soortEvent: acf.soort_event || "festival",
      subtitel: acf.subtitel,
      wanneer: acf.wanneer || {
        start: "",
        einde: "",
      },
      locatieNaam: acf.locatie_naam || "",
      adres: acf.adres,
      ticketLink: acf.ticket_link || "",
    };

    return {
      id: String(post.id),
      title: post.title.rendered,
      slug: post.slug,
      featuredImage: featuredImage || {
        node: {
          sourceUrl: "",
        },
      },
      eventInfo,
    };
  });

  return { nodes };
}
