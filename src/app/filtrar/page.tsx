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
import ModalSearch from '@/components/ModalSearch';
import DishCard from '@/components/DishCard';

// Importa el tema custom
import { getCustomTheme } from '@/components/MUI/CustomTheme';


export default function Home() {
  // Estados para el drawer y el modal
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Parametros de busqueda
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo');
  const tipoU = tipo?.toUpperCase();

  // Detecta si el sistema está en dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

  // Estados para los alimentos
  const [alimentos, setAlimentos] = React.useState<{ id: number; nombre: string; precio: number; kcal: number }[]>([]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box marginTop={12}>
        <FixedNavBar
          onAccountClick={() => setDrawerOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          currentTab={undefined}
        />
        <RightDrawer open={drawerOpen} setOpen={setDrawerOpen} />
        <ModalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

        <Typography variant="h4" component="h1" sx={{ p: { xs: 2, sm: 3 }, marginX: { sm: 2} }}>
          {tipoU}
        </Typography>
        <Grid container sx={{ marginX: { xs: 2, sm: 5 } }}>
          {alimentos.map((alimento) => (
            <Grid size={4} key={alimento.nombre}>
              <DishCard
                id={alimento.id}
                nombrePlatillo={alimento.nombre}
                precio={alimento.precio}
                calorias={alimento.kcal}
                />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}