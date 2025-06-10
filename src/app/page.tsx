"use client";

import * as React from 'react';

// Componentes MUI
import { Box, Grid, ThemeProvider, CssBaseline, useMediaQuery, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles'; // Import para usar el tema

// Navegación Next.js
import { useRouter } from 'next/navigation';

// Componentes custom
import FixedNavBar from '@/components/FixedNavBar';
import RightDrawer from '@/components/RightDrawer';
import SearchButton from '@/components/SearchButton';
import ModalSearch from '@/components/ModalSearch';
import Options from '@/components/Options';
import ImageCarousel from '@/components/ImageCarousel';
import DishCard from '@/components/DishCard';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// Colección de información
const TipoAlimento = [
  { nombre: "Desayunos", imagen: "/icons/Desayuno.webp", link: "/buscar?tipo=desayuno" },
  { nombre: "Tortas", imagen: "/icons/Torta.webp", link: "/buscar?tipo=torta" },
  { nombre: "Sandwich", imagen: "/icons/Sandwich.webp", link: "/buscar?tipo=sandwich" },
  { nombre: "Molletes", imagen: "/icons/Molletes.webp", link: "/buscar?tipo=mollete" },
  { nombre: "Chilaquiles", imagen: "/icons/Chilaquiles.webp", link: "/buscar?tipo=chilaquiles" },
  { nombre: "Tacos", imagen: "/icons/Taco.webp", link: "/buscar?tipo=taco" },
  { nombre: "Antojitos", imagen: "/icons/Antojito.webp", link: "/buscar?tipo=antojito" },
  { nombre: "Postres", imagen: "/icons/Postre.webp", link: "/buscar?tipo=postre" },
  { nombre: "Bebida calientes", imagen: "/icons/BebidaCaliente.webp", link: "/buscar?tipo=bebidacaliente" },
  { nombre: "Bebida frias", imagen: "/icons/BebidaFria.webp", link: "/buscar?tipo=bebidafria" }
];

export default function Home() {
  // Detecta si el sistema está en dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

  // Hook de MUI para acceder al tema y sus breakpoints
  const muiTheme = useTheme();
  // Detecta si el ancho de la pantalla corresponde a un móvil (breakpoint 'sm' de MUI)
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Estados para el modal y el drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Estados para los alimentos
  const [alimentos, setAlimentos] = React.useState<{ nombre: string; precio: number; kcal: number }[]>([]);

  // Navegación
  const router = useRouter();

  React.useEffect(() => {
    const fetchAlimentos = async () => {
      try {
        const res = await fetch('/api/alimentos');
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

  // Componente que renderiza cada una de las opciones
  interface TipoAlimentoItem {
    nombre: string;
    imagen: string;
    link: string;
  }

  interface RenderOptionsProps {
    item: TipoAlimentoItem;
  }

  const renderOptions = (item: TipoAlimentoItem): React.ReactElement => (
    <Options
      texto={item.nombre}
      srcImagen={item.imagen}
      onClick={() => router.push(item.link)}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box marginTop={12}>
        <Grid container>
          <FixedNavBar
            onAccountClick={() => setDrawerOpen(true)}
            onSearchClick={() => setSearchOpen(true)}
            currentTab="home"
          />
          <RightDrawer open={drawerOpen} setOpen={setDrawerOpen} />
          <SearchButton onClick={() => setSearchOpen(true)} />
          <ModalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
        </Grid>

        {isMobile ? (
          // Vista de Carrusel para Móviles
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              paddingX: 1,
              scrollSnapType: 'x mandatory',
              '&::-webkit-scrollbar': { display: 'none' }, // Oculta scrollbar en Chrome/Safari
              scrollbarWidth: 'none', // Oculta scrollbar en Firefox
              msOverflowStyle: 'none', // Oculta scrollbar en IE/Edge (corregido)
            }}
          >
            {TipoAlimento.map((item) => (
              <Box
                key={item.nombre}
                sx={{
                  flex: '0 0 calc(100% / 3)', // Muestra 3 items a la vez
                  padding: 1,
                  scrollSnapAlign: 'start',
                }}
              >
                <Options
                  texto={item.nombre}
                  srcImagen={item.imagen}
                  onClick={() => router.push(item.link)}
                />
              </Box>
            ))}
          </Box>
        ) : (
          // Vista de Grid para Tablets y Escritorio
          <Grid container spacing={2} paddingX={5}>
            {TipoAlimento.map((item) => (
              <Grid size={1.2} key={item.nombre}>
                {renderOptions(item)}
              </Grid>
            ))}
          </Grid>
        )}

        <ImageCarousel />
        <Box>
          <Typography variant="h5" sx={{ marginX: { xs: 1, sm: 5 } }}>
            Los favoritos
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            paddingY: 2,
            marginX: { xs: 1, sm: 5 }, // Padding diferente para móvil y escritorio
            gap: 2, // Espacio entre las tarjetas
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              borderRadius: 4,
            },
            scrollbarWidth: 'none', // Oculta scrollbar en Firefox
            msOverflowStyle: 'none', // Oculta scrollbar en IE/Edge (corregido)
          }}
        >
          {alimentos.map((alimento) => (
            <Box key={alimento.nombre} sx={{ flex: '0 0 auto' }}> {/* Contenedor para cada tarjeta */}
              <DishCard
                nombrePlatillo={alimento.nombre}
                precio={alimento.precio}
                calorias={alimento.kcal}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}