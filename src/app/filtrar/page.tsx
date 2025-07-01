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
import Loading from '@/components/Loading';

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

  // Estado para los promedios de los alimentos filtrados
  const [alimentosRatings, setAlimentosRatings] = React.useState<{ [id: number]: number }>({});

  // Estado de carga
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAll = async () => {
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
          if (data.data.length > 0) {
            const ids = data.data.map((a: any) => a.id_alimento);
            const res2 = await fetch('/api/alimentos/calificacion', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids })
            });
            const data2 = await res2.json();
            if (data2.success && data2.ratings) setAlimentosRatings(data2.ratings);
          }
        }
      } catch (error) {
        console.error("Error al cargar los alimentos: " + error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [tipo]);

  if (!mounted) return null;
  if (loading) return <Loading />;

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
        <Grid container sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 0 }, justifyContent: 'center' }}>
          {alimentos.map((alimento) => (
            <Grid size={{xs: 12, md: 4}} key={alimento.nombre} sx={{ marginY: { xs: 1, sm: 3} }}>
              <DishCard
                id={alimento.id_alimento}
                nombrePlatillo={alimento.nombre}
                precio={alimento.precio}
                calorias={alimento.calorias}
                imagen={alimento.imagen}
                rating={alimentosRatings[alimento.id_alimento]}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}