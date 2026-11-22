"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ComponentType, type ReactNode } from "react";
import { Camera, Film, Image as ImageIcon, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/features/landing/components/brand-mark";
import { useAuth } from "../providers/auth-provider";
import {
  DetectionSocketProvider,
  useDetectionSocket,
  type SocketStatus,
} from "../realtime/detection-socket";
import { Spinner, focusRing } from "@/components/ui";

export const NAV: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}[] = [
  { href: "/moramora", label: "Vue d'ensemble", icon: LayoutGrid },
  { href: "/moramora/photo", label: "Photo", icon: ImageIcon },
  { href: "/moramora/video", label: "Vidéo", icon: Film },
  { href: "/moramora/direct", label: "Direct", icon: Camera },
];

const STATUS_LABEL: Record<SocketStatus, string> = {
  connecting: "Connexion au temps réel…",
  open: "Temps réel actif",
  reconnecting: "Temps réel indisponible, nouvelle tentative…",
  unauthorized: "Session expirée",
};

export function ConnectionStatus({ className }: { className?: string }) {
  const { status } = useDetectionSocket();
  const short =
    status === "open" ? "En ligne" : status === "connecting" ? "Connexion…" : "Hors ligne";
  return (
    <span
      role="status"
      title={STATUS_LABEL[status]}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border border-line bg-raised px-3 text-[12px] text-fg-2",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          status === "open"
            ? "bg-gaspika"
            : status === "connecting"
              ? "animate-pulse bg-fg-3"
              : "bg-moramora",
        )}
      />
      <span aria-hidden="true">{short}</span>
      <span className="sr-only">{STATUS_LABEL[status]}</span>
    </span>
  );
}

function isActive(pathname: string, href: string) {
  return href === "/moramora" ? pathname === href : pathname.startsWith(href);
}

function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const initial = user?.username.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/moramora"
          className={`flex shrink-0 items-center gap-2.5 rounded-[8px] ${focusRing}`}
          aria-label="Moramora — vue d'ensemble"
        >
          <BrandMark size={22} />
          <span className="text-[16px] font-medium text-fg">Moramora</span>
        </Link>

        <nav aria-label="Navigation Moramora" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-[8px] px-3 text-sm transition-colors duration-150",
                      focusRing,
                      active
                        ? "bg-raised text-fg"
                        : "text-fg-2 hover:bg-raised/60 hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ConnectionStatus />
          <Link
            href="/moramora/profil"
            aria-current={pathname === "/moramora/profil" ? "page" : undefined}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border border-line-strong bg-raised text-[13px] font-medium text-fg transition-colors hover:border-divider",
              focusRing,
              pathname === "/moramora/profil" && "border-ember/60",
            )}
          >
            <span aria-hidden="true">{initial}</span>
            <span className="sr-only">
              Mon profil{user ? ` (${user.username})` : ""}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Bottom tab bar on small screens: thumb-reachable, always visible. */
function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation Moramora"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-4">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] transition-colors",
                  focusRing,
                  "focus-visible:ring-offset-0",
                  active ? "text-fg" : "text-fg-3 hover:text-fg",
                )}
              >
                <Icon
                  aria-hidden
                  className={cn("size-5", active && "text-ember")}
                />
                {item.label === "Vue d'ensemble" ? "Accueil" : item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function AlertAnnouncer() {
  const { announcement } = useDetectionSocket();
  return (
    <p aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </p>
  );
}

function FullScreenLoader({ label }: { label: string }) {
  return (
    <div
      role="status"
      className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-4 text-sm text-fg-2"
    >
      <BrandMark size={28} />
      <span className="flex items-center gap-2">
        <Spinner className="size-3.5 text-fg-3" />
        {label}
      </span>
    </div>
  );
}

export function MoramoraShell({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "anonymous") {
      router.replace(`/connexion?suivant=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status !== "authenticated") {
    return (
      <FullScreenLoader
        label={status === "loading" ? "Chargement…" : "Redirection vers la connexion…"}
      />
    );
  }

  return (
    <DetectionSocketProvider>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-[8px] focus:border focus:border-line-strong focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-fg focus:outline-none"
      >
        Aller au contenu
      </a>
      <Header />
      <main
        id="contenu"
        tabIndex={-1}
        className="mx-auto w-full max-w-[80rem] flex-1 px-4 pt-8 pb-28 outline-none sm:px-6 md:pb-16 lg:px-8 lg:pt-12"
      >
        {children}
      </main>
      <MobileNav />
      <AlertAnnouncer />
    </DetectionSocketProvider>
  );
}
