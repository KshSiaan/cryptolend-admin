import { UserNavbar } from "@/components/user-navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <UserNavbar />
      <main className="flex-1 w-full max-w-lg mx-auto px-4 pb-8">
        {children}
      </main>
    </div>
  );
}
