"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UsuarioInitializer() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetch("/api/usuario", { method: "GET" });
    }
  }, [isLoaded, isSignedIn]);

  return null;
}