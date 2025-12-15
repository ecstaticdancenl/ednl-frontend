/**
 * Fetch functions for WordPress Pages
 */

import {
  fetchWordPressAPI,
  transformFeaturedImage,
  FetchOptions,
} from "./utils";
import { WordPressPost, TransformedPage } from "./types";

/**
 * Fetch a page by slug
 */
export async function fetchPageBySlug(slug: string): Promise<TransformedPage | null> {
  const posts = await fetchWordPressAPI<WordPressPost>("pages", {
    slug,
    _embed: true,
  });

  if (posts.length === 0) {
    return null;
  }

  const post = posts[0];
  const featuredImage = transformFeaturedImage(post);

  return {
    id: String(post.id),
    title: post.title.rendered,
    slug: post.slug,
    content: post.content.rendered,
    featuredImage: featuredImage || undefined,
  };
}

/**
 * Fetch a page by name (title)
 * Note: WordPress REST API doesn't have a direct "name" filter,
 * so we fetch all pages and filter client-side
 */
export async function fetchPageByName(name: string): Promise<TransformedPage | null> {
  const posts = await fetchWordPressAPI<WordPressPost>("pages", {
    per_page: 100,
    _embed: true,
  });

  // Find page by title (case-insensitive)
  const post = posts.find(
    (p) => p.title.rendered.toLowerCase() === name.toLowerCase()
  );

  if (!post) {
    return null;
  }

  const featuredImage = transformFeaturedImage(post);

  return {
    id: String(post.id),
    title: post.title.rendered,
    slug: post.slug,
    content: post.content.rendered,
    featuredImage: featuredImage || undefined,
  };
}
