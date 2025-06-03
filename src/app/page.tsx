"use client";

import * as React from 'react';

// Componente MUI
import { Box } from "@mui/material";

// Componentes custom
import FixedNavBar from '@/components/FixedNavBar';
import RightDrawer from "@/components/RightDrawer";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <Box marginTop={14}>
      <FixedNavBar onAccountClick={() => setDrawerOpen(true)} />
      <RightDrawer open={drawerOpen} setOpen={setDrawerOpen} />
    </Box>
  );
}
