import { UserGuard } from "@/components/user-guard";
import { UserNavbar } from "@/components/user-navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserGuard>
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 w-full max-w-lg mx-auto px-4 pb-8">
          {children}
        </main>
        <UserNavbar />
      </div>
    </UserGuard>
  );
}
