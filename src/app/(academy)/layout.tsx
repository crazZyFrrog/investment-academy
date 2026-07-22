import { AppShell } from "@/components/layout/AppShell";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
