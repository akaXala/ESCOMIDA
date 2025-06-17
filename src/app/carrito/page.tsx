"use client";

import * as React from 'react';
import { ThemeProvider, CssBaseline, useMediaQuery, Box, Typography } from "@mui/material";

// Componente personalizado
import CartItem from '@/components/CartItem';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

export default function Home () {
    // Detecta si el sistema está en dark mode
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

    // Estado para los items del carrito
    const [items, setItems] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

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

    return(
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>Tu Carrito</Typography>
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
                            onDelete={(id_item: number) => setItems(items => items.filter(i => i.id_item !== id_item))} // <-- Agrega esto
                        />
                    ))
                )}
            </Box>
        </ThemeProvider>
    );
}