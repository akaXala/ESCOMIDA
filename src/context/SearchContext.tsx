"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Alimento {
  id_alimento: number;
  nombre: string;
  precio: number;
  calorias: number;
}

interface SearchContextProps {
  alimentos: Alimento[];
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch debe usarse dentro de SearchProvider");
  return ctx;
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    // Solo consulta una vez
    fetch("/api/alimentos")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAlimentos(data.data);
      });
  }, []);

  return (
    <SearchContext.Provider
      value={{
        alimentos,
        searchOpen,
        openSearch: () => setSearchOpen(true),
        closeSearch: () => setSearchOpen(false),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}