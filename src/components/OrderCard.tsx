// components/OrderCard.tsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  useTheme, // Import useTheme to access theme palette
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Define the type for an order item (adjust if your structure is different)
interface OrderItem {
  cantidad: number;
  nombre: string;
}

// Define the type for the entire order object (adjust if your structure is different)
interface Order {
  id_pedido: number;
  items?: OrderItem[]; // items can be optional or an empty array
  telefono?: string; // Optional if not always present
  precio_total?: number; // Optional if not always present
  estatus: string;
  // Add other properties of your order object here if needed
}

interface OrderCardProps {
  order: Order;
  handleMarkAsDelivered: (id: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, handleMarkAsDelivered }) => {
  const theme = useTheme(); // Access the current theme

  // Helper to format items string
  const formatItems = (items?: OrderItem[]) => {
    if (!items || items.length === 0) {
      return 'Sin items';
    }
    return items.map(item => `${item.cantidad}x ${item.nombre}`).join(', ');
  };

  return (
    <Grid item xs={12} sm={6} md={4} key={order.id_pedido}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.paper, // Using theme colors
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ color: theme.palette.info.main, mb: 1 }}>
            Pedido #{order.id_pedido}
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
            **Pedido:** {formatItems(order.items)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Teléfono: {order.telefono || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: ${order.precio_total ? order.precio_total.toFixed(2) : '0.00'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
            Estado: {order.estatus}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => handleMarkAsDelivered(order.id_pedido)}
          >
            Marcar como Entregado
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default OrderCard;