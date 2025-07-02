import React from "react";
import { Card, CardContent, Typography, Button, Box, Stack, Chip } from "@mui/material";

interface PedidoCardProps {
  id_pedido: number;
  nombre_usuario: string;
  productos: string[];
  estatus: string;
  onVerDetalles: () => void;
}

const statusColors: Record<string, "default" | "primary" | "warning" | "success" | "info"> = {
  "En espera": "default",
  "Preparando": "warning",
  "Listo para recoger": "info",
  "Entregado": "success",
};

const PedidoCard: React.FC<PedidoCardProps> = ({ id_pedido, nombre_usuario, productos, estatus, onVerDetalles }) => {
  return (
    <Card sx={{ minWidth: 300, maxWidth: 400, m: 1, boxShadow: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Pedido #{id_pedido}</Typography>
          <Chip label={estatus} color={statusColors[estatus] || "default"} size="small" />
        </Stack>
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          Ordenado por: <b>{nombre_usuario}</b>
        </Typography>
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button variant="contained" onClick={onVerDetalles}>
            Ver detalles
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PedidoCard;
