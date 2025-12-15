/**
 * Fetch functions for WordPress Organisations custom post type
 */

import {
  fetchWordPressAPI,
  transformFeaturedImage,
  FetchOptions,
} from "./utils";
import {
  WordPressPostWithACF,
  ACFOrganisatieGegevens,
  ACFOrganisatieGegevensRaw,
  TransformedOrganisation,
  OrganisationsResponse,
} from "./types";

// Build-time cache for organisations
// This cache persists for the entire Node.js process lifetime (entire build)
let organisationsCache: OrganisationsResponse | null = null;
let cachePromise: Promise<OrganisationsResponse> | null = null;

/**
 * Transform WordPress posts to TransformedOrganisation format
 */
function transformPostsToOrganisations(
  posts: WordPressPostWithACF<ACFOrganisatieGegevensRaw>[]
): TransformedOrganisation[] {
  return posts.map((post) => {
    const featuredImage = transformFeaturedImage(post);
    
    // Transform snake_case ACF fields to camelCase for component usage
    const acf = post.acf || {} as ACFOrganisatieGegevensRaw;
    const acfOrganisatieGegevens: ACFOrganisatieGegevens = {
      website: acf.website || "",
      email: acf.email || "",
      locaties: acf.locaties || [],
      social_media: acf.social_media,
      hipsy: acf.hipsy
        ? {
            slug: acf.hipsy.slug || "",
            apiKey: acf.hipsy.api_key || "",
            actief: acf.hipsy.actief || false,
          }
        : undefined,
    };
    
    return {
      id: String(post.id),
      title: post.title.rendered,
      slug: post.slug,
      content: post.content.rendered,
      featuredImage: featuredImage || {
        node: {
          sourceUrl: "",
        },
      },
      acfOrganisatieGegevens,
    };
  });
}

/**
 * Fetch all organisations from WordPress REST API
 * Uses build-time cache to avoid redundant API calls during static generation
 */
export async function fetchOrganisations(
  options: FetchOptions = {}
): Promise<OrganisationsResponse> {
  // Return cached data if available
  if (organisationsCache !== null) {
    return organisationsCache;
  }

  // If cache is being populated, wait for it
  if (cachePromise !== null) {
    return await cachePromise;
  }

  // Start fetching and cache the promise to handle concurrent calls
  cachePromise = (async () => {
    const defaultOptions: FetchOptions = {
      per_page: 100, // WordPress REST API maximum
      orderby: "title",
      order: "asc",
      _embed: true,
      ...options,
    };

    const posts = await fetchWordPressAPI<
      WordPressPostWithACF<ACFOrganisatieGegevensRaw>
    >("organisaties", defaultOptions);

    const nodes = transformPostsToOrganisations(posts);
    const result: OrganisationsResponse = { nodes };

    // Store in cache
    organisationsCache = result;
    return result;
  })();

  return await cachePromise;
}

/**
 * Fetch a single organisation by slug
 * Uses build-time cache to avoid redundant API calls during static generation
 */
export async function fetchOrganisationBySlug(
  slug: string
): Promise<TransformedOrganisation | null> {
  // Ensure cache is populated
  const cached = await fetchOrganisations();
  
  // Look up organisation by slug from cached data
  const organisation = cached.nodes.find((org) => org.slug === slug);
  
  return organisation || null;
}
