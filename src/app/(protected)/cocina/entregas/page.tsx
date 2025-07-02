// app/cocina/entregas/page.jsx
"use client";

import * as React from 'react';
import { Button, ThemeProvider, CssBaseline, useMediaQuery, Typography, Box, CircularProgress, Alert, Grid, Card, CardContent, CardActions } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getCustomTheme } from '@/components/MUI/CustomTheme';
import FixedNavBarKitchen from '@/components/FixedNavBarKitchen';
import OrderCard from "@/components/OrderCard"
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // Icon for delivery
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icon for marking as delivered

export default function Home() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

    const { isSignedIn, signOut } = useAuth();
    const router = useRouter();

    // Este estado ahora contendrá los pedidos 'Listo para entregar'
    const [readyForDeliveryOrders, setReadyForDeliveryOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Función para obtener los pedidos
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/ordenes/mostrar-pedidos-items');
            const data = await res.json();

            if (res.ok && data.success) {
                // Filtra para mostrar SOLO los pedidos con estatus 'Listo para entregar'
                const filteredOrders = data.pedidos.filter(order => order.estatus === 'Listo para entregar');
                setReadyForDeliveryOrders(filteredOrders);
            } else {
                console.error("API Error fetching orders:", data.error);
                setError("Error al cargar pedidos listos para entrega: " + (data.error || "Desconocido"));
            }
        } catch (err) {
            console.error("Network or parsing error fetching orders:", err);
            setError("Error de conexión al cargar pedidos listos para entrega.");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchOrders(); // Primera carga al montar el componente

        // Polling para mantener la lista actualizada
        const interval = setInterval(fetchOrders, 15000); // Cada 15 segundos

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, []);

    // Manejador para marcar un pedido como "Entregado"
    const handleMarkAsDelivered = async (orderId) => {
        // Optimistic UI update: Eliminar el pedido de la lista inmediatamente
        setReadyForDeliveryOrders(prevOrders => prevOrders.filter(order => order.id_pedido !== orderId));
        console.log(`Order ${orderId} marked as delivered. Attempting to update status to 'Entregado' in backend.`);

        try {
            // Asume que tienes un endpoint PUT /api/ordenes/entregado/[orderId]
            const res = await fetch(`/api/ordenes/entregado/${orderId}`, {
                method: 'PUT',
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                console.error(`Backend failed to update order ${orderId} to 'Entregado':`, data.error);
                // Revert optimistic update if API call fails (optional, but good practice)
                // You might need to re-fetch all orders or add the order back to the list
                fetchOrders(); // Re-fetch to ensure consistency if optimistic update failed
                setError("No se pudo marcar el pedido como entregado: " + (data.error || "Error desconocido"));
            } else {
                setError(null); // Clear error on success
            }
        } catch (err) {
            console.error(`Network error marking order ${orderId} as delivered:`, err);
            fetchOrders(); // Re-fetch on network error
            setError("Error de conexión al marcar pedido como entregado.");
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const handleListOrders = () => {
        router.push("/cocina"); // Volver a la página principal de la cocina
    };

    const handlePopularIngredients = () => {
        router.push("/cocina/ingredientes");
    };

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: theme.palette.background.default, p: 3 }}>
                    <CircularProgress color="primary" sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        Cargando pedidos listos para entrega...
                    </Typography>
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 12,
                    padding: { xs: 2, sm: 3, md: 4 },
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <FixedNavBarKitchen
                    onListOrdersListClick={handleListOrders}
                    onLogutClick={handleSignOut}
                    onMostPoularClick={handlePopularIngredients}
                    currentTab="entregas"
                />

                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: theme.palette.text.primary, mb: 4 }}>
                    <LocalShippingIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 'inherit' }} /> Pedidos Listos para Entrega
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3} justifyContent="center">
                    {readyForDeliveryOrders.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 4 }}>
                                No hay pedidos listos para entregar en este momento.
                            </Typography>
                        </Grid>
                    ) : (
                        readyForDeliveryOrders.map(order => (
                            <OrderCard
                                key={order.id_pedido} // Remember to put the key on the component being mapped
                                order={order}
                                handleMarkAsDelivered={handleMarkAsDelivered}
                            />
                        ))
                    )}
                </Grid>

                {isSignedIn && (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleSignOut}
                        >
                            Cerrar Sesión
                        </Button>
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    );
}