// app/cocina/page.jsx
"use client";

import * as React from 'react';

// MUI Components
import { Button, ThemeProvider, CssBaseline, useMediaQuery, Typography, Box } from "@mui/material";
// Clerk Sessions
import { useAuth } from "@clerk/nextjs";
// Next.js Navigation
import { useRouter } from "next/navigation";
// Custom Theme
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// Kitchen Specific Components
import FixedNavBarKitchen from '@/components/FixedNavBarKitchen';
import NewOrdersSection from '@/components/NewOrdersSection'; // Import the new component
import PendingOrdersSection from '@/components/PendingOrdersSection'; // Import the new component

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

    // --- State for Orders (Managed in the parent Home component) ---
    const [newOrders, setNewOrders] = React.useState([
        { id: 'ORD001', food: 'Pizza Hawaiana', estimatedTime: '30 min', status: 'new' },
        { id: 'ORD002', food: 'Ensalada César', estimatedTime: '15 min', status: 'new' },
        { id: 'ORD003', food: 'Pasta Carbonara', estimatedTime: '25 min', status: 'new' },
    ]);

    const [pendingOrders, setPendingOrders] = React.useState([
        { id: 'PEND001', food: 'Hamburguesa Clásica', estimatedTime: '20 min', status: 'pending' },
    ]);

    // --- Handlers for Order Actions (Passed down as props) ---
    const handleAcceptOrder = (orderId) => {
        setNewOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        const acceptedOrder = newOrders.find(order => order.id === orderId);
        if (acceptedOrder) {
            setPendingOrders(prevPending => [...prevPending, { ...acceptedOrder, status: 'pending' }]);
            console.log(`Order ${orderId} accepted.`);
        }
    };

    const handleRejectOrder = (orderId) => {
        setNewOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        console.log(`Order ${orderId} rejected.`);
    };

    const handleCompleteOrder = (orderId) => {
        setPendingOrders(prevPending => prevPending.filter(order => order.id !== orderId));
        console.log(`Order ${orderId} completed.`);
    };

    // --- Navigation and Auth Handlers ---
    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const handleListOrders = () => {
        console.log("Navegar a la lista de órdenes");
        router.push("/cocina/pedidos");
    };

    const handlePopularIngredients = () => {
        console.log("Navegar a la sección de ingredientes más populares");
        router.push("/cocina/ingredientes");
    };

    if (!mounted) return null;

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

                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: theme.palette.text.primary, mb: 4 }}>
                    Bienvenido, Chef!
                </Typography>

                {/* Render the NewOrdersSection component */}
                <NewOrdersSection
                    newOrders={newOrders}
                    onAcceptOrder={handleAcceptOrder}
                    onRejectOrder={handleRejectOrder}
                />

                {/* Render the PendingOrdersSection component */}
                <PendingOrdersSection
                    pendingOrders={pendingOrders}
                    onCompleteOrder={handleCompleteOrder}
                />

                {/* Sign Out Button (at the end) */}
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