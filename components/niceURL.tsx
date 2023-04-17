export function niceURL(url: string) {
  let cleanURL = url
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.", "");
  if (cleanURL.endsWith("/")) {
    cleanURL = cleanURL.slice(0, -1);
  }
  return cleanURL;
}
