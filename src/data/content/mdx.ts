import { serialize } from "next-mdx-remote/serialize";

export async function serializeLessonContent(content: string) {
  return serialize(content, {
    parseFrontmatter: false,
  });
}
