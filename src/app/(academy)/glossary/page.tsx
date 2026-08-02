import { getGlossaryTerms } from "@/data/content/glossary";
import { GlossaryPageClient } from "@/features/glossary/GlossaryPageClient";

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms();
  return <GlossaryPageClient terms={terms} />;
}
