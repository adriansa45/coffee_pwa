"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function LandingPage() {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard/passport",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-50 text-brand-950 font-sans">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-brand-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-brand-900">
          Pasaporte del Café
        </h1>

        <p className="text-lg mb-12 text-brand-800 leading-relaxed max-w-xs">
          Descubre las mejores cafeterías, colecciona sellos y obtén recompensas exclusivas.
        </p>

        <div className="w-full max-w-xs space-y-4">
          <Button onClick={signIn} className="w-full py-6 text-lg bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md transition-all active:scale-95">
            Empezar con GitHub
          </Button>

          <p className="text-xs text-brand-700/60 transition-opacity hover:opacity-100">
            Al continuar, aceptas nuestros términos y condiciones.
          </p>
        </div>
      </main>

      <footer className="p-6 text-center text-brand-900/40 text-sm">
        &copy; 2024 Coffee Passport. Hecho con ❤️ para amantes del café.
      </footer>
    </div>
  );
}
