"use client";

import * as React from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ThemeProvider, CssBaseline, useMediaQuery, Box, Typography, Button } from "@mui/material";

// Iconos MUI
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

// Componente personalizado
import CartItem from '@/components/CartItem';
import FixedNavBar from '@/components/FixedNavBar';
import RightDrawer from '@/components/RightDrawer';
import { useSearch } from '@/context/SearchContext';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';
import { mostrarAlerta } from '@/components/SweetAlert/modalAlerts';

export default function Home () {
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
            router.replace(`/sign-in?redirect_url=/carrito`);
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
    const borderColor = (themeMode === 'light') ? '#0044ff' : '#91a8fd';

    const [items, setItems] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { openSearch } = useSearch();

    React.useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch('/api/carrito/items');
                const data = await res.json();
                if (data.success) {
                    setItems(data.data);
                }
            } catch (error) {
                // Manejo de error
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const addOrder = async () => {
        try {
            const response = await fetch("/api/ordenes/crear", {
                method: "POST",
            });
            const data = await response.json();
            if (data.success) {
                mostrarAlerta("Pedido creado correctamente", "El pedido se creo correctamente", "Aceptar", "success");
                router.push("/ordenes"); // Cambia la ruta según tu app
            } else {
                mostrarAlerta("No se pudo crear el pedido", `${data.error}`, "Aceptar", "error");
            }
        } catch (error) {
            mostrarAlerta("Error", "No se pudo crear el pedido", "Aceptar", "error");
        }
    }

    // Evita renderizar hasta que esté montado en cliente
    if (!mounted) return null;

    return(
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box sx={{ maxWidth: 600, mx: 'auto'}} marginTop={{xs: 8.5, sm: 13.5}}>
                <FixedNavBar
                    onAccountClick={() => setDrawerOpen(true)}
                    onSearchClick={openSearch}
                    currentTab={undefined}
                />
                <RightDrawer open={drawerOpen} setOpen={setDrawerOpen} />
                <Typography variant="h4" sx={{ mb: 3, mt: 2 }}>Tu Carrito</Typography>
                {loading ? (
                    <Typography>Cargando...</Typography>
                ) : items.length === 0 ? (
                    <Typography>No hay productos en el carrito.</Typography>
                ) : (
                    items.map((item) => (
                        <CartItem
                            key={item.id_item}
                            id_item={item.id_item}
                            nombre={item.nombre}
                            categoria={item.categoria}
                            ingredientes_obligatorios={item.ingredientes_obligatorios?.split(',') ?? []}
                            salsa={item.salsa?.split(',') ?? []}
                            extra={item.extra?.split(',') ?? []}
                            ingredientes_opcionales={item.ingredientes_opcionales?.split(',') ?? []}
                            imagen={item.imagen}
                            cantidad={item.cantidad}
                            precio_final={item.precio_final}
                            onDelete={(id_item: number) => setItems(items => items.filter(i => i.id_item !== id_item))}
                        />
                    ))
                )}
            </Box>
            {items.length === 0 ? (
                <></>
            ) : (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} marginBottom={{ xs: 8.5, sm: 3}}>
                    <Button
                    variant="contained"
                    size="large"
                    sx={{
                        py: 1.5,
                        px: 8,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        bgcolor: borderColor,
                    }}
                    startIcon={<ShoppingCartCheckoutIcon />}
                    onClick={addOrder} // <-- Ahora llama a addOrder
                    >
                        Realizar pedido
                    </Button>
                </Box>
            )}
        </ThemeProvider>
    );
}