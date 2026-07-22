import { TopBar } from "./TopBar";
import { SideNav } from "./SideNav";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <SideNav />
      <div className="flex min-h-screen flex-1 flex-col pb-16 lg:pb-0">
        <TopBar />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
