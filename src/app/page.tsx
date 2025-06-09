"use client";

import * as React from 'react';

// Componentes MUI
import { Box, Grid, ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
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

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const router = useRouter();

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
              // Se usa la prop "item" y las props responsivas "sm", "md", "lg"
              <Grid size={1.2} key={item.nombre}>
                {renderOptions(item)}
              </Grid>
            ))}
          </Grid>
        )}

        <ImageCarousel />
      </Box>
    </ThemeProvider>
  );
}