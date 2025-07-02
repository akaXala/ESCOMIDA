"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline, useMediaQuery, Typography, Box, Grid, CircularProgress } from "@mui/material";
import { getCustomTheme } from '@/components/MUI/CustomTheme';
import PedidoCard from '@/components/PedidoCard';
import PedidoDetallesModal from '@/components/PedidoDetallesModal';

interface Item {
  id_item: number;
  categoria: string;
  nombre: string;
  ingredientes_obligatorios: string;
  salsa?: string;
  extra?: string;
  ingredientes_opcionales?: string;
  precio: number;
  imagen?: string;
  cantidad: number;
  id_original: number;
  precio_final: number;
}

interface Pedido {
  id_pedido: number;
  id: string;
  estatus: string;
  items: Item[];
  nombre_usuario: string;
}

export default function CocinaPrepararPage() {
  const [mounted, setMounted] = React.useState(false);
  const [pedidos, setPedidos] = React.useState<Pedido[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = React.useState<Pedido | null>(null);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(() => getCustomTheme(mounted && prefersDarkMode ? 'dark' : 'light'), [mounted, prefersDarkMode]);

  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    if (!mounted) return;
    fetch("/api/ordenes/mostrar-todos")
      .then(res => res.json())
      .then(async data => {
        if (data.success) {
          const pedidosConDetalles = await Promise.all(data.data.map(async (pedido: any) => {
            // Obtener nombre de usuario desde Clerk
            let nombre_usuario = pedido.id;
            try {
              const userRes = await fetch(`/api/usuario?id=${pedido.id}`);
              const userData = await userRes.json();
              if (userData.success && userData.data && userData.data.nombre) {
                nombre_usuario = userData.data.nombre;
              }
            } catch {}
            // Obtener items completos
            let items: Item[] = [];
            try {
              const itemsRes = await fetch("/api/ordenes/mostrar-detalles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_pedido: pedido.id_pedido })
              });
              const itemsData = await itemsRes.json();
              if (itemsData.success) {
                items = itemsData.data;
              }
            } catch {}
            return { ...pedido, nombre_usuario, items };
          }));
          setPedidos(pedidosConDetalles);
        }
        setLoading(false);
      });
  }, [mounted]);

  const handleVerDetalles = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setModalOpen(true);
  };

  const handleCambiarEstado = async (nuevoEstado: string) => {
    if (!pedidoSeleccionado) return;
    await fetch("/api/ordenes/cambiar-estado", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_pedido: pedidoSeleccionado.id_pedido, nuevo_estado: nuevoEstado })
    });
    setPedidos(pedidos => pedidos.map(p => p.id_pedido === pedidoSeleccionado.id_pedido ? { ...p, estatus: nuevoEstado } : p));
    setPedidoSeleccionado(p => p ? { ...p, estatus: nuevoEstado } : p);
  };

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>Pedidos en cocina</Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {pedidos.map((pedido) => (
              <Grid key={pedido.id_pedido} size={{xs: 12, sm: 6, md: 4, xl: 3}}>
                <PedidoCard
                  id_pedido={pedido.id_pedido}
                  nombre_usuario={pedido.nombre_usuario}
                  productos={pedido.items.map(i => i.nombre)}
                  estatus={pedido.estatus}
                  onVerDetalles={() => handleVerDetalles(pedido)}
                />
              </Grid>
            ))}
          </Grid>
        )}
        <PedidoDetallesModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          pedido={pedidoSeleccionado}
          onCambiarEstado={handleCambiarEstado}
        />
      </Box>
    </ThemeProvider>
  );
}