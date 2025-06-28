"use client";

import * as React from 'react';
import { useSearch } from '@/context/SearchContext';

// Componentes MUI
import { Box, Grid, ThemeProvider, CssBaseline, useMediaQuery, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles'; // Import para usar el tema

// Navegación Next.js
import { useRouter } from 'next/navigation';

// Componentes custom
import FixedNavBar from '@/components/FixedNavBar';
import RightDrawer from '@/components/RightDrawer';
import SearchButton from '@/components/SearchButton';
import Options from '@/components/Options';
import ImageCarousel from '@/components/ImageCarousel';
import DishCard from '@/components/DishCard';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// Colección de información
const TipoAlimento = [
  { nombre: "Desayunos", imagen: "/icons/Desayuno.webp", link: "/filtrar?tipo=Desayuno" },
  { nombre: "Tortas", imagen: "/icons/Torta.webp", link: "/filtrar?tipo=Torta" },
  { nombre: "Sandwich", imagen: "/icons/Sandwich.webp", link: "/filtrar?tipo=Sandwichito" },
  { nombre: "Molletes", imagen: "/icons/Molletes.webp", link: "/filtrar?tipo=Mollete" },
  { nombre: "Chilaquiles", imagen: "/icons/Chilaquiles.webp", link: "/filtrar?tipo=Chilaquiles" },
  { nombre: "Tacos", imagen: "/icons/Taco.webp", link: "/filtrar?tipo=Taco" },
  { nombre: "Antojitos", imagen: "/icons/Antojito.webp", link: "/filtrar?tipo=Quesos y Antojos" },
  { nombre: "Postres", imagen: "/icons/Postre.webp", link: "/filtrar?tipo=Postre" },
  { nombre: "Bebida calientes", imagen: "/icons/BebidaCaliente.webp", link: "/filtrar?tipo=Bebida Caliente" },
  { nombre: "Bebida frias", imagen: "/icons/BebidaFria.webp", link: "/filtrar?tipo=Bebida Fría" }
];

export default function Home() {
  // Estado para saber si estamos en el cliente
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  // Detecta si el sistema está en dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(() => getCustomTheme(mounted && prefersDarkMode ? 'dark' : 'light'), [mounted, prefersDarkMode]);

  // Hook de MUI para acceder al tema y sus breakpoints
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Usa el contexto global para abrir el modal
  const { openSearch } = useSearch();

  // Estado global para los alimentos (solo se consulta una vez)
  const [alimentos, setAlimentos] = React.useState<{ id_alimento: number; nombre: string; precio: number; calorias: number; imagen: string }[]>([]);
  const alimentosFetched = React.useRef(false);

  // Estado para los favoritos del usuario
  const [favoritos, setFavoritos] = React.useState<{ id_alimento: number; nombre: string; precio: number; calorias: number; imagen: string }[]>([]);

  // Estado para los mejor calificados
  const [mejorCalificados, setMejorCalificados] = React.useState<{ id_alimento: number; nombre: string; precio: number; calorias: number; imagen: string; promedio: number; total_resenas: number }[]>([]);

  // Estado para los promedios de favoritos
  const [favoritosRatings, setFavoritosRatings] = React.useState<{ [id: number]: number }>({});

  // Estado para los promedios de mejor calificados
  const [mejorCalificadosRatings, setMejorCalificadosRatings] = React.useState<{ [id: number]: number }>({});

  // Estado para los promedios de todos los alimentos
  const [alimentosRatings, setAlimentosRatings] = React.useState<{ [id: number]: number }>({});

  // Navegación
  const router = useRouter();

  React.useEffect(() => {
    if (!mounted) return;
    const fetchMejorCalificados = async () => {
      try {
        const res = await fetch('/api/alimentos/mejor-calificados');
        const data = await res.json();
        if (data.success) {
          setMejorCalificados(data.data);
        }
      } catch (error) {
        // Silenciar error
      }
    };
    fetchMejorCalificados();
  }, [mounted]);

  React.useEffect(() => {
    // Solo consulta si está montado
    if (!mounted) return;
    const fetchFavoritos = async () => {
      try {
        const res = await fetch('/api/alimentos/favoritos');
        const data = await res.json();
        if (data.success) {
          setFavoritos(data.data);
        }
      } catch (error) {
        // Silenciar error si no está autenticado
      }
    };
    fetchFavoritos();
  }, [mounted]);

  React.useEffect(() => {
    // Solo consulta si no se ha hecho antes
    if (alimentosFetched.current) return;
    alimentosFetched.current = true;
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

  React.useEffect(() => {
    if (favoritos.length === 0) return;
    const fetchRatings = async () => {
      try {
        const ids = favoritos.map(a => a.id_alimento);
        const res = await fetch('/api/alimentos/calificacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        });
        const data = await res.json();
        if (data.success && data.ratings) {
          setFavoritosRatings(data.ratings);
        }
      } catch {}
    };
    fetchRatings();
  }, [favoritos]);

  React.useEffect(() => {
    if (mejorCalificados.length === 0) return;
    const fetchRatings = async () => {
      try {
        const ids = mejorCalificados.map(a => a.id_alimento);
        const res = await fetch('/api/alimentos/calificacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        });
        const data = await res.json();
        if (data.success && data.ratings) {
          setMejorCalificadosRatings(data.ratings);
        }
      } catch {}
    };
    fetchRatings();
  }, [mejorCalificados]);

  React.useEffect(() => {
    if (alimentos.length === 0) return;
    const fetchRatings = async () => {
      try {
        const ids = alimentos.map(a => a.id_alimento);
        const res = await fetch('/api/alimentos/calificacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        });
        const data = await res.json();
        if (data.success && data.ratings) {
          setAlimentosRatings(data.ratings);
        }
      } catch {}
    };
    fetchRatings();
  }, [alimentos]);

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

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box marginTop={{xs: 7, sm: 12}} marginBottom={{xs: 6, sm: 0}}>
        <Grid container>
          <FixedNavBar
            onAccountClick={() => setDrawerOpen(true)}
            onSearchClick={openSearch}
            currentTab="home"
          />
          <RightDrawer open={drawerOpen} setOpen={setDrawerOpen} />
          <SearchButton onClick={openSearch} />
        </Grid>

        {mounted && isMobile ? (
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
        {/* Carrusel de favoritos del usuario autenticado */}
        {favoritos.length > 0 && (
          <>
            <Box>
              <Typography variant="h5" sx={{ marginX: { xs: 1, sm: 5 } }}>
                Tus favoritos
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                paddingY: 2,
                marginX: { xs: 1, sm: 5 },
                gap: 2,
                '&::-webkit-scrollbar': { height: 8 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  borderRadius: 4,
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {favoritos.map((alimento) => (
                <Box key={alimento.nombre} sx={{ flex: '0 0 auto' }}>
                  <DishCard
                    id={alimento.id_alimento}
                    nombrePlatillo={alimento.nombre}
                    precio={alimento.precio}
                    calorias={alimento.calorias}
                    imagen={alimento.imagen}
                    rating={favoritosRatings[alimento.id_alimento]}
                  />
                </Box>
              ))}
            </Box>
          </>
        )}
        {/* Carrusel de mejor calificados */}
        {mejorCalificados.length > 0 && (
          <>
            <Box>
              <Typography variant="h5" sx={{ marginX: { xs: 1, sm: 5 } }}>
                Mejor calificados
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                paddingY: 2,
                marginX: { xs: 1, sm: 5 },
                gap: 2,
                '&::-webkit-scrollbar': { height: 8 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  borderRadius: 4,
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {mejorCalificados.map((alimento) => (
                <Box key={alimento.nombre} sx={{ flex: '0 0 auto' }}>
                  <DishCard
                    id={alimento.id_alimento}
                    nombrePlatillo={alimento.nombre}
                    precio={alimento.precio}
                    calorias={alimento.calorias}
                    imagen={alimento.imagen}
                    rating={mejorCalificadosRatings[alimento.id_alimento]}
                  />
                </Box>
              ))}
            </Box>
          </>
        )}
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
                id={alimento.id_alimento}
                nombrePlatillo={alimento.nombre}
                precio={alimento.precio}
                calorias={alimento.calorias}
                imagen={alimento.imagen}
                rating={alimentosRatings[alimento.id_alimento]}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}