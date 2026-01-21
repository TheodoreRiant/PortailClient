import Link from "next/link";
import { config } from "@/config";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground">
            {config.app.name.charAt(0)}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {config.app.name}
          </h1>
          <p className="max-w-md text-lg text-slate-600 dark:text-slate-400">
            Accédez à vos projets, livrables et factures en toute simplicité.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Se connecter
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500 dark:text-slate-500">
          Besoin d&apos;aide ? Contactez votre gestionnaire de compte.
        </p>
      </main>
    </div>
  );
}
