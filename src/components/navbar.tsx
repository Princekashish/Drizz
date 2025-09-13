// src/components/Navbar.tsx
import Link from "next/link";

interface NavbarProps {
  session: null | {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  };
}

export default function Navbar({ session }: NavbarProps) {
  return (
    <div className="px-5 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-[1.4em] text-amber-400">News Pinch</h1>
      </div>

      {session?.user ? (
        <div className="flex items-center gap-4">
          <img
            src={session.user.image || "/default-profile.png"}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
          <Link href="/api/auth/signout">
            <button className="px-4 py-2 rounded-3xl bg-white/20">Logout</button>
          </Link>
        </div>
      ) : (
        <Link href="/login">
          <button className="px-4 py-2 rounded-3xl bg-white/20">Login</button>
        </Link>
      )}
    </div>
  );
}
