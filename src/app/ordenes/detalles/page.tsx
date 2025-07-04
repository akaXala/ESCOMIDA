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
import RateModal from '@/components/RateModal';
import Loading from '@/components/Loading';

// Iconos
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';
import { mostrarAlerta } from '@/components/SweetAlert/modalAlerts';
import { mostrarConfirmacion } from '@/components/SweetAlert/confirmAlert';

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
    const [rateOpen, setRateOpen] = React.useState(false);
    const [rateLoading, setRateLoading] = React.useState(false);

    React.useEffect(() => {
      const fetchOrder = async () => {
        try {
          if (!orderDetails) { router.replace('/ordenes'); return; }
          setLoading(true);
          const res = await fetch('/api/ordenes/mostrar-detalles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id_pedido: orderDetails.id_pedido})
          });
          const data = await res.json();
          if(data.success) {
            setItems(data.data)
          }
        } catch (error) {
          console.log("Error");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }, [orderDetails]);

    const deleteOrder = async () => {
      const confirmed = await mostrarConfirmacion(
        '¿Seguro que deseas cancelar el pedido?',
        'Esta acción no se puede deshacer.',
        'Sí, cancelar',
        'No',
        'warning',
        themeMode
      );

      if (!confirmed) return;

      try {
        const res = await fetch ('/api/ordenes/cancelar', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({id_pedido: orderDetails.id_pedido})
        });
        const data = await res.json();
        if (data.success) {
          await mostrarAlerta('Pedido cancelado', 'Tu pedido ha sido cancelado exitosamente.', 'OK', 'success', themeMode);
          router.replace('/ordenes');
        } else {
          await mostrarAlerta('Error', 'No se pudo cancelar el pedido.', 'OK', 'error', themeMode);
        }
      } catch (error) {
        await mostrarAlerta('Error', 'Ocurrió un error al cancelar el pedido.', 'OK', 'error', themeMode);
      }
    }

    // Prepara los alimentos para el modal
    const alimentosToRate = items.map(item => ({
      id_alimento: item.id_original, // Usar id_original como id_alimento
      nombre: item.nombre,
      imagen: item.imagen || '/404.webp',
    }));

    // Función para enviar las calificaciones
    const handleRateSubmit = async (results: { id_alimento: number; puntuacion: number; comentario: string }[]) => {
      console.log('Enviando calificaciones a la API:', results); // <-- Log para depuración
      setRateLoading(true);
      try {
        const res = await fetch('/api/ordenes/calificar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(results),
        });
        const data = await res.json();
        if (data.success) {
          await mostrarAlerta('¡Gracias!', 'Tus calificaciones han sido registradas.', 'OK', 'success', themeMode);
          setRateOpen(false);
        } else {
          await mostrarAlerta('Error', 'No se pudieron guardar las calificaciones.', 'OK', 'error', themeMode);
        }
      } catch (error) {
        await mostrarAlerta('Error', 'Ocurrió un error al calificar.', 'OK', 'error', themeMode);
      }
      setRateLoading(false);
    };

    // Evita renderizar hasta que esté montado en cliente
    if (!mounted) return null;
    if (loading) return <Loading />;
    if (!orderDetails) return <Typography>No hay detalles de la orden.</Typography>;

    return(
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box marginTop={{xs: 9.5, sm: 14.5}}>
                <Grid container>
                    <FixedNavBar
                        onAccountClick={() => setDrawerOpen(true)}
                        onSearchClick={openSearch}
                        currentTab="orders"
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
                    <Typography variant='overline'>{orderDetails.cantidad} items</Typography>
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
                  {items.length === 0 ? (
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
                <Grid container marginBottom={{xs: 2, sm: 3}} sx={{ marginX: { xs: 2, sm: 5 }}}>
                  <Grid size={12}>
                    <Typography variant='h5'>Resumen de pago</Typography>
                  </Grid>
                  <Grid size={12} marginTop={2}>
                    <Typography variant='h6'>Total: ${orderDetails.precio_total}</Typography>
                  </Grid>
                  <Grid size={12} marginBottom={{ xs: 1, sm: 3}}>
                    <Typography variant='body2'>Forma de pago: </Typography>
                  </Grid>
                </Grid>
                {/* Botón Cancelar Pedido solo si el estatus es 'En espera' */}
                {orderDetails.estatus === 'En espera' && (
                  <Grid
                    container
                    sx={{
                      marginX: { xs: 2, sm: 5 },
                      mb: { xs: 8, sm: 4 },
                      mt: { xs: 0, sm: 0 },
                    }}
                    justifyContent="center"
                  >
                    <Grid size={12}>
                      <button
                        style={{
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#d32f2f',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          marginTop: '0',
                          marginBottom: '8px',
                          transition: 'background 0.2s',
                        }}
                        onClick={deleteOrder}
                      >
                        Cancelar pedido
                      </button>
                    </Grid>
                  </Grid>
                )}

                {/* Botón Calificar Alimentos solo si el estatus es 'Entregado' */}
                {orderDetails.estatus === 'Entregado' && (
                  <Grid
                    container
                    sx={{
                      marginX: { xs: 2, sm: 5 },
                      mb: { xs: 8, sm: 4 },
                      mt: { xs: 0, sm: 0 },
                    }}
                    justifyContent="center"
                  >
                    <Grid size={12}>
                      <button
                        style={{
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#d0b006',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          marginTop: '0',
                          marginBottom: '8px',
                          transition: 'background 0.2s',
                        }}
                        onClick={() => setRateOpen(true)}
                        disabled={rateLoading}
                      >
                        Calificar alimentos
                      </button>
                    </Grid>
                  </Grid>
                )}
                {/* Modal para calificar alimentos */}
                <RateModal
                  alimentos={alimentosToRate}
                  isOpen={rateOpen}
                  onClose={() => setRateOpen(false)}
                  onSubmit={handleRateSubmit}
                />
            </Box>
        </ThemeProvider>
    );
}