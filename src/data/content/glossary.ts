import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const termSchema = z.object({
  id: z.string().min(1),
  term: z.string().min(1),
  definition: z.string().min(1),
  relatedCourseSlugs: z.array(z.string()).optional(),
});

const termsSchema = z.array(termSchema).min(1);

export type GlossaryTerm = z.infer<typeof termSchema>;

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const filePath = path.join(
    process.cwd(),
    "content",
    "glossary",
    "terms.json"
  );
  const raw = await fs.readFile(filePath, "utf8");
  return termsSchema.parse(JSON.parse(raw));
}
