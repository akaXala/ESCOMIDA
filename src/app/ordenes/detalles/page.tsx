"use client";

import * as React from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

// Componentes MUI
import { ThemeProvider, CssBaseline, useMediaQuery, Box, Typography, Grid, Avatar } from "@mui/material";

// Componente personalizado
import OrderItem from '@/components/OrderItem';
import FixedNavBar from '@/components/FixedNavBar';
import RightDrawer from '@/components/RightDrawer';
import { useSearch } from '@/context/SearchContext';
import { useOrderDetails } from '@/context/OrderDetailsContext';

// Iconos
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// Icono según estatus
function getStatusIcon(estatus: string, color: string) {
  switch (estatus) {
    case 'En espera':
      return <AccessTimeIcon />;
    case 'Preparando':
      return <LocalDiningIcon />;
    case 'Listo para recoger':
      return <CheckCircleIcon />;
    case 'Entregado':
      return <DoneAllIcon />;
    default:
      return <AccessTimeIcon />;
  }
}

export default function Home() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    // Estado para saber si estamos en el cliente
    const [mounted, setMounted] = React.useState(false);

    // Verificar que este montado
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Verificación del loggeo
    React.useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace(`/sign-in?redirect_url=/ordenes`);
        }
    }, [isLoaded, isSignedIn, router]);

    // SIEMPRE llama al hook, pero solo úsalo si está montado
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () => getCustomTheme(mounted && prefersDarkMode ? 'dark' : 'light'),
        [mounted, prefersDarkMode]
    );

    // Variables y funciones de la página
    const themeMode = mounted && prefersDarkMode ? 'dark' : 'light';
    const backgroundColor = (themeMode === 'light') ? '#0334BA' : '#6C84DB';

    // Hooks
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { openSearch } = useSearch();
    const { orderDetails } = useOrderDetails();
    const [items, setItems] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const fetchOrder = async () => {
        try {
          if (!orderDetails) router.replace('/ordenes');
          setLoading(true);
          console.log("Consulta")

          const res = await fetch('/api/ordenes/mostrar-detalles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id_pedido: orderDetails.id_pedido})
          });

          const data = await res.json();

          if(data.success) {
            setItems(data.data)
          }
          setLoading(false);
        } catch (error) {
          console.log("Error");
        }
      };
      fetchOrder();
    }, []);

    // Evita renderizar hasta que esté montado en cliente
    if (!mounted) return null;
    if (!orderDetails) return <Typography>No hay detalles de la orden.</Typography>;

    return(
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box marginTop={{xs: 9.5, sm: 14.5}}>
                <Grid container>
                    <FixedNavBar
                        onAccountClick={() => setDrawerOpen(true)}
                        onSearchClick={openSearch}
                        currentTab={undefined}
                    />
                    <RightDrawer open={drawerOpen} setOpen={setDrawerOpen} />
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  spacing={2}
                  sx={{ marginX: { xs: 2, sm: 5 } }}
                >
                  <Grid>
                    <Avatar sx={{ bgcolor: backgroundColor, width: 56, height: 56 }}>
                      {getStatusIcon(orderDetails.estatus, backgroundColor)}
                    </Avatar>
                  </Grid>
                  <Grid>
                    <Typography variant="h5" fontWeight="bold">
                      Orden {(orderDetails.estatus).toLowerCase()}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Orden #{orderDetails.id_pedido} • {new Date(orderDetails.fecha).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ marginX: { xs: 2, sm: 5 }, mt: 5}}
                >
                  <Grid size={12}>
                    <Typography variant='h5'>Tu orden</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant='overline'>N items</Typography>
                  </Grid>
                </Grid>
                {/* Ejemplo de platillo estilo imagen */}
                <Grid
                  container
                  sx={{
                    marginX: { xs: 1, sm: 3 },
                    mt: 3,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                    p: 2,
                  }}
                  alignItems="flex-start"
                  spacing={2}
                >
                  {loading ? (
                    <Grid size={12}>
                      <Typography>Cargando...</Typography>
                    </Grid>
                  ) : items.length === 0 ? (
                    <Grid size={12}>
                      <Typography>No hay nada que mostrar.</Typography>
                    </Grid>
                  ) : (
                    items.map((item, idx) => (
                      <Grid size={12} key={item.id_item || idx} sx={{ mb: 2 }}>
                        <OrderItem
                          image={item.imagen || "/404.webp"}
                          title={item.nombre}
                          category={item.categoria}
                          quantity={item.cantidad}
                          ingredientes_obligatorios={item.ingredientes_obligatorios?.split(',') ?? []}
                          salsas={item.salsa?.split(',') ?? []}
                          extras={item.extra?.split(',') ?? []}
                          ingredientes_opcionales={item.ingredientes_opcionales?.split(',') ?? []}
                          price={item.precio}
                          final_price={item.precio_final}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
                <Grid
                  container
                  sx={{ marginX: { xs: 2, sm: 5 }}}
                >
                  <Grid size={12}>
                    <Typography variant='h5'>Resumen de pago</Typography>
                  </Grid>
                  <Grid size={12} marginTop={2}>
                    <Typography variant='h6'>Total: ${orderDetails.precio_total}</Typography>
                  </Grid>
                  <Grid size={12} marginBottom={{ xs: 8.5, sm: 3}}>
                    <Typography variant='body2'>Forma de pago: </Typography>
                  </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}