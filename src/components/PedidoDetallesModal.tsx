import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, Chip, Box } from "@mui/material";
import OrderItem from "./OrderItem";

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

interface PedidoDetallesModalProps {
  open: boolean;
  onClose: () => void;
  pedido: {
    id_pedido: number;
    nombre_usuario: string;
    items: Item[];
    estatus: string;
  } | null;
  onCambiarEstado: (nuevoEstado: string) => void;
}

const estados = ["En espera", "Preparando", "Listo para recoger", "Entregado"];

const PedidoDetallesModal: React.FC<PedidoDetallesModalProps> = ({ open, onClose, pedido, onCambiarEstado }) => {
  if (!pedido) return null;
  const { id_pedido, nombre_usuario, items, estatus } = pedido;
  const idx = estados.indexOf(estatus);
  const siguienteEstado = idx >= 0 && idx < estados.length - 1 ? estados[idx + 1] : null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles del pedido #{id_pedido}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">Ordenado por: <b>{nombre_usuario}</b></Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body2">Estatus:</Typography>
          <Chip label={estatus} color="primary" size="small" />
        </Stack>
        <Box>
          {items.map((item) => (
            <OrderItem
              key={item.id_item}
              image={item.imagen}
              title={item.nombre}
              category={item.categoria}
              quantity={item.cantidad}
              ingredientes_obligatorios={item.ingredientes_obligatorios ? item.ingredientes_obligatorios.split(",") : []}
              salsas={item.salsa ? [item.salsa] : []}
              extras={item.extra ? [item.extra] : []}
              ingredientes_opcionales={item.ingredientes_opcionales ? item.ingredientes_opcionales.split(",") : []}
              price={item.precio}
              final_price={item.precio_final}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        {siguienteEstado && (
          <Button variant="contained" color="primary" onClick={() => onCambiarEstado(siguienteEstado)}>
            {estatus === "En espera" && "Preparar"}
            {estatus === "Preparando" && "Listo para recoger"}
            {estatus === "Listo para recoger" && "Entregar"}
          </Button>
        )}
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PedidoDetallesModal;
