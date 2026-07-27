import { getStoryblokApi } from "./storyblok";

export async function getNavigation() {
  const storyblokApi = getStoryblokApi();

  const { data } = await storyblokApi.get("cdn/links", {
    version: "published",
  });

const allLinks = Object.values(data.links);

  const filteredLinks = allLinks.filter((link) => {
    const slug = link.slug;

    if (!slug) return false;

    if (slug === "home") return false;

    if (slug.startsWith("globals")) return false;

    if (slug.startsWith("footer")) return false;

    if (slug.startsWith("blog/")) return false;

    return true;
  });
  return filteredLinks;
}