"use client";

import ModalSearch from "@/components/ModalSearch";
import { useSearch } from "@/context/SearchContext";

export default function GlobalModals() {
  const { searchOpen, closeSearch, alimentos } = useSearch();
  return (
    <ModalSearch open={searchOpen} onClose={closeSearch} alimentos={alimentos} />
  );
}