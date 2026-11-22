"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/moramora/providers/auth-provider";
import { nextPath } from "@/lib/router-utils";

export function useRedirectAuthenticated() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(nextPath());
    }
  }, [status, router]);
}
