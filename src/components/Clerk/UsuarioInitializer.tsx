"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function UsuarioInitializer() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetch("/api/usuario", { method: "GET" })
        .then((res) => res.json())
        .then((usuario) => {
          if (usuario.success && usuario.data) {
            // Si no tiene teléfono y no está en /numero, redirige
            if (!usuario.data.telefono && pathname !== "/numero") {
              router.replace("/numero");
            } else if (usuario.data.telefono && pathname === "/numero") {
              // Si ya tiene teléfono y está en /numero, mándalo a home
              router.replace("/");
            }
          }
        });
    }
  }, [isLoaded, isSignedIn, router, pathname]);

  return null;
}