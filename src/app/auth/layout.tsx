import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.svg"
            alt="Solbridge Capital"
            width={140}
            height={46}
            className="h-9 w-auto"
            unoptimized
          />
        </div>
        {children}
      </div>
    </div>
  );
}
