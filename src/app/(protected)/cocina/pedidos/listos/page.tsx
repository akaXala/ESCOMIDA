// app/cocina/page.jsx
"use client";

import * as React from 'react';

// MUI Components
import { Button, ThemeProvider, CssBaseline, useMediaQuery, Typography, Box, CircularProgress, Alert } from "@mui/material"; // Added Alert for error messages
// Clerk Sessions
import { useAuth } from "@clerk/nextjs";
// Next.js Navigation
import { useRouter } from "next/navigation";
// Custom Theme
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// Kitchen Specific Components
import FixedNavBarKitchen from '@/components/FixedNavBarKitchen';
import NewOrdersSection from '@/components/NewOrdersSection';
import PendingOrdersSection from '@/components/PendingOrdersSection'; // This component will now handle 'Cocinando' and 'Listo para entregar'

export default function Home() {
    // State to check if we are on the client
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);

    // Detect if the system is in dark mode
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => getCustomTheme(mounted && prefersDarkMode ? 'dark' : 'light'), [mounted, prefersDarkMode]);

    // Clerk Sessions
    const { isSignedIn, signOut } = useAuth();
    // Next.js Navigation
    const router = useRouter();

    // --- State for Orders and Loading ---
    const [allOrders, setAllOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null); // State for API errors

    // --- Fetch Orders from API ---
    React.useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true); // Set loading true before fetch
            setError(null);   // Clear any previous errors
            try {
                const res = await fetch('/api/ordenes/mostrar-pedidos-items');
                const data = await res.json();

                if (data.success) {
                    setAllOrders(data.pedidos);
                } else {
                    console.error("API Error fetching orders:", data.error);
                    setError("Error al cargar pedidos: " + (data.error || "Desconocido"));
                }
            } catch (err) {
                console.error("Network or parsing error fetching orders:", err);
                setError("Error de conexión al cargar pedidos.");
            } finally {
                setLoading(false);
            }
        };

        if (mounted) {
            fetchOrders(); // Initial fetch

            // Set up polling for new orders every 15 seconds
            const interval = setInterval(fetchOrders, 15000); // Poll every 15 seconds

            // Clean up the interval on component unmount
            return () => clearInterval(interval);
        }
    }, [mounted]);

    // --- Filter and Map Orders Based on Status ---
    // 'En espera' are truly new orders
    const newOrderStatuses = ['En espera'];
    // 'Cocinando' and 'Listo para entregar' are pending in the kitchen's workflow
    const pendingOrderStatuses = ['Cocinando', 'Listo para entregar'];

    const newOrders = allOrders
        .filter(order => newOrderStatuses.includes(order.estatus))
        .map(order => ({
            id: order.id_pedido,
            food: order.items ? order.items.map(item => `${item.cantidad}x ${item.nombre}`).join(', ') : 'Sin items',
            estimatedTime: 'N/A', // No se muestra selector de tiempo
            status: order.estatus, // Usar el estatus real del backend
            telefono: order.telefono,
            precioTotal: order.precio_total,
            // Añade cualquier otro dato relevante que NewOrdersSection necesite
        }));

    const pendingOrders = allOrders
        .filter(order => pendingOrderStatuses.includes(order.estatus))
        .map(order => ({
            id: order.id_pedido,
            food: order.items ? order.items.map(item => `${item.cantidad}x ${item.nombre}`).join(', ') : 'Sin items',
            estimatedTime: 'N/A', // No se muestra selector de tiempo
            status: order.estatus, // Usar el estatus real del backend ('Cocinando' o 'Listo para entregar')
            telefono: order.telefono,
            precioTotal: order.precio_total,
            // Añade cualquier otro dato relevante que PendingOrdersSection necesite
        }));

    // --- Handlers for Order Actions (Update UI and Backend) ---

    // Handles accepting a new order (changes status from 'En espera' to 'Cocinando')
    const handleAcceptOrder = async (orderId) => {
        // Optimistic UI update
        setAllOrders(prevOrders => prevOrders.map(order =>
            order.id_pedido === orderId ? { ...order, estatus: 'Cocinando' } : order
        ));
        console.log(`Order ${orderId} accepted. Attempting to update status to 'Cocinando' in backend.`);

        try {
            const res = await fetch(`/api/ordenes/cocinando/${orderId}`, {
                method: 'PUT',
            });
            const data = await res.json();
            if (!data.success) {
                console.error(`Backend failed to update order ${orderId} to 'Cocinando':`, data.error);
                // Revert optimistic update if API call fails
                setAllOrders(prevOrders => prevOrders.map(order =>
                    order.id_pedido === orderId ? { ...order, estatus: 'En espera' } : order
                ));
                setError("No se pudo aceptar el pedido: " + (data.error || "Error desconocido"));
            } else {
                setError(null); // Clear error on success
            }
        } catch (err) {
            console.error(`Network error updating order ${orderId} to 'Cocinando':`, err);
            // Revert optimistic update if network error
            setAllOrders(prevOrders => prevOrders.map(order =>
                order.id_pedido === orderId ? { ...order, estatus: 'En espera' } : order
            ));
            setError("Error de conexión al aceptar el pedido.");
        }
    };

    // Handles rejecting a new order (removes it from current view)
    const handleRejectOrder = async (orderId) => {
        // Optimistic UI update: remove from the list
        setAllOrders(prevOrders => prevOrders.filter(order => order.id_pedido !== orderId));
        console.log(`Order ${orderId} rejected. Removed from UI.`);

        // TODO: Decide backend behavior for rejected orders.
        // Option 1: Update status to 'Rechazado' via a new PUT endpoint:
        // Consider creating /api/ordenes/rechazado/:id
        // try {
        //     const res = await fetch(`/api/ordenes/rechazado/${orderId}`, { method: 'PUT' });
        //     const data = await res.json();
        //     if (!data.success) {
        //         console.error(`Backend failed to reject order ${orderId}:`, data.error);
        //         // Optionally re-add to allOrders if backend update fails
        //     }
        // } catch (error) {
        //     console.error(`Network error rejecting order ${orderId} in backend:`, error);
        // }
    };

    // Handles completing a pending order (changes status from 'Cocinando' to 'Listo para entregar')
    const handleCompleteOrder = async (orderId) => {
        // Optimistic UI update
        setAllOrders(prevOrders => prevOrders.map(order =>
            order.id_pedido === orderId ? { ...order, estatus: 'Listo para entregar' } : order
        ));
        console.log(`Order ${orderId} completed. Attempting to update status to 'Listo para entregar' in backend.`);

        try {
            const res = await fetch(`/api/ordenes/listo/${orderId}`, {
                method: 'PUT',
            });
            const data = await res.json();
            if (!data.success) {
                console.error(`Backend failed to update order ${orderId} to 'Listo para entregar':`, data.error);
                // Revert optimistic update if API call fails
                setAllOrders(prevOrders => prevOrders.map(order =>
                    order.id_pedido === orderId ? { ...order, estatus: 'Cocinando' } : order // Assuming previous state was 'Cocinando'
                ));
                setError("No se pudo marcar como listo el pedido: " + (data.error || "Error desconocido"));
            } else {
                setError(null); // Clear error on success
            }
        } catch (err) {
            console.error(`Network error updating order ${orderId} to 'Listo para entregar':`, err);
            // Revert optimistic update if network error
            setAllOrders(prevOrders => prevOrders.map(order =>
                order.id_pedido === orderId ? { ...order, estatus: 'Cocinando' } : order // Revert to prior status
            ));
            setError("Error de conexión al marcar pedido como listo.");
        }
    };


    // --- Navigation and Auth Handlers ---
    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const handleListOrders = () => {
        console.log("Navegar a la lista de órdenes");
        router.push("/cocina/pedidos"); // Consider this page for 'Entregado' orders history
    };

    const handlePopularIngredients = () => {
        console.log("Navegar a la sección de ingredientes más populares");
        router.push("/cocina/ingredientes");
    };

    // Render loading indicator or error message
    if (!mounted || loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        backgroundColor: theme.palette.background.default,
                        p: 3
                    }}
                >
                    <CircularProgress color="primary" sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        Cargando pedidos...
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
                    marginTop: 12, // Space for the fixed navbar
                    padding: { xs: 2, sm: 3, md: 4 }, // Responsive padding
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <FixedNavBarKitchen
                    onListOrdersListClick={handleListOrders}
                    onLogutClick={handleSignOut}
                    onMostPoularClick={handlePopularIngredients}
                    currentTab="kitchen"
                />


                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* New Orders Section: For 'En espera' orders */}
                <PendingOrdersSection
                    pendingOrders={pendingOrders}
                    onCompleteOrder={handleCompleteOrder}
                />
              

                {/* Pending Orders Section: For 'Cocinando' and 'Listo para entregar' orders */}
            

                {/* Sign Out Button */}
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