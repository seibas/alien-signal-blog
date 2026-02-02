import { getAllPosts } from "@/content/posts";
import BlogIndexClient from "@/components/BlogIndexClient";

export default async function BlogIndex() {
  const posts = await getAllPosts();
  const sorted = posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  return <BlogIndexClient initialPosts={sorted} />;
}
