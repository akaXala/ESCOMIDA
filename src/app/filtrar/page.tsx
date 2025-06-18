'use client';

import * as React from 'react';

// Componentes MUI
import { Box, Typography, CssBaseline, Grid } from '@mui/material';
// Para el tema
import { ThemeProvider, useMediaQuery } from '@mui/material';

// Para extraer parametros
import { useSearchParams } from 'next/navigation';

// Importa los componentes custom
import FixedNavBar from '@/components/FixedNavBar';
import RightDrawer from '@/components/RightDrawer';
import DishCard from '@/components/DishCard';

// Importa el tema custom
import { getCustomTheme } from '@/components/MUI/CustomTheme';
import { useSearch } from '@/context/SearchContext';

export default function Home() {
  // Estado para saber si estamos en el cliente
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  // Estados para el drawer y el modal
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Usa el contexto global para abrir el modal
  const { openSearch } = useSearch();

  // Parametros de busqueda
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo');
  const tipoU = tipo?.toUpperCase();

  // Detecta si el sistema está en dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(() => getCustomTheme(mounted && prefersDarkMode ? 'dark' : 'light'), [mounted, prefersDarkMode]);

  // Estados para los alimentos
  const [alimentos, setAlimentos] = React.useState<{ id_alimento: number; nombre: string; precio: number; calorias: number, imagen: string }[]>([]);

  React.useEffect(() => {
      const fetchAlimentos = async () => {
        try {
          if (!tipo) return;
          const res = await fetch('/api/alimentos/filtrar',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoria: tipo })
          });

          const data = await res.json();
  
          if (data.success) { 
            setAlimentos(data.data);
          }
        } catch (error) {
          console.error("Error al cargar los alimentos: " + error);
        }
      };
      fetchAlimentos();
    }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box marginTop={{xs: 7, sm: 12}}>
        <FixedNavBar
          onAccountClick={() => setDrawerOpen(true)}
          onSearchClick={openSearch}
          currentTab={undefined}
        />
        <RightDrawer open={drawerOpen} setOpen={setDrawerOpen} />

        <Typography variant="h4" component="h1" sx={{ p: { xs: 2, sm: 3 }, marginX: { sm: 2} }}>
          {tipoU}
        </Typography>
        <Grid container sx={{ marginX: { xs: 2, sm: 5 } }}>
          {alimentos.map((alimento) => (
            <Grid size={4} key={alimento.nombre}>
              <DishCard
                id={alimento.id_alimento}
                nombrePlatillo={alimento.nombre}
                precio={alimento.precio}
                calorias={alimento.calorias}
                imagen={alimento.imagen}
                />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}