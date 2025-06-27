import React, { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  AddCircleOutline,
  RemoveCircleOutline,
  Delete,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

// 1. INTERFAZ DE PROPS BASADA EN TU ESQUEMA DE BD
interface ItemProps {
  id_item: number;
  nombre: string;
  categoria: string;
  ingredientes_obligatorios: string[];
  salsa?: string[];
  extra?: string[];
  ingredientes_opcionales?: string[];
  imagen: string;
  cantidad: number;
  precio_final: number;
  onDelete?: (id_item: number) => void;
}

// 2. DEFINICIÓN DEL COMPONENTE
const CartItem: React.FC<ItemProps> = ({
  id_item,
  nombre,
  categoria,
  ingredientes_obligatorios,
  salsa,
  ingredientes_opcionales,
  extra,
  imagen,
  cantidad,
  precio_final,
  onDelete,
}) => {
  const [quantity, setQuantity] = useState(cantidad ?? 1);
  const [price, setPrice] = useState(precio_final);
  const [ingredientsVisible, setIngredientsVisible] = useState(false);
  const theme = useTheme();

  // 3. MANEJADORES DE EVENTOS
  const handleIncrease = async () => {
    try {
      const res = await fetch('/api/carrito/items/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_item }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuantity(data.cantidad);
        setPrice(data.precio_final);
      } else {
        // Maneja el error (opcional: mostrar mensaje)
      }
    } catch (err) {
      // Maneja el error de red (opcional)
    }
  };

  const handleDecrease = async () => {
    if (quantity > 1) {
      try {
        const res = await fetch('/api/carrito/items/decrement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_item }),
        });
        if (res.ok) {
          const data = await res.json();
          setQuantity(data.cantidad);
          setPrice(data.precio_final);
        } else {
          // Maneja el error (opcional: mostrar mensaje)
        }
      } catch (err) {
        // Maneja el error de red (opcional)
      }
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/carrito/items/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_item }),
      });
      if (res.ok) {
        if (onDelete) onDelete(id_item);
      } else {
        // Maneja el error (opcional)
      }
    } catch (err) {
      // Maneja el error de red (opcional)
    }
  };

  const toggleIngredients = () => {
    setIngredientsVisible((prev) => !prev);
  };

  // 4. LÓGICA PARA COMBINAR INGREDIENTES
  const allIngredients = [
    ...ingredientes_obligatorios,
    ...(ingredientes_opcionales || []),
  ];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // 5. RENDERIZADO DEL COMPONENTE
  return (
    <Card sx={{ display: 'flex', my: 2, p: 2, borderRadius: 4, boxShadow: 3 }}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, borderRadius: 2, alignSelf: 'center' }}
        image={imagen}
        alt={nombre}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              {nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {categoria}
            </Typography>
          </Box>
          <Typography variant="h6" component="div" fontWeight="bold">
            {formatPrice(price)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            mt: 1,
          }}
          onClick={toggleIngredients}
        >
          <IconButton size="small">
            {ingredientsVisible ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        
        <Collapse in={ingredientsVisible} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Ingredientes:</Typography>
            <Typography variant="body2" color="text.secondary">
              {allIngredients.join(', ')}
            </Typography>
            {/* Mostrar Salsas solo si existen y no son vacías */}
            {Array.isArray(salsa) && salsa.filter(s => s && s.trim() !== '').length > 0 && (
              <>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>Salsas:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {salsa.filter(s => s && s.trim() !== '').join(', ')}
                </Typography>
              </>
            )}
            {/* Mostrar Extras solo si existen y no son vacíos */}
            {Array.isArray(extra) && extra.filter(e => e && e.trim() !== '').length > 0 && (
             <>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>Extras:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {extra.filter(e => e && e.trim() !== '').join(', ')}
                </Typography>
             </>
            )}
          </Box>
        </Collapse>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 'auto' }} paddingTop={1}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '50px',
              p: '2px 8px',
            }}
          >
            {quantity === 1 ? (
              <IconButton color="error" onClick={handleDelete} size="small">
                <Delete />
              </IconButton>
            ) : (
              <IconButton
                onClick={handleDecrease}
                size="small"
                sx={{
                  color: theme.palette.mode === 'light' ? '#000' : '#fff',
                }}
              >
                <RemoveCircleOutline />
              </IconButton>
            )}
            <Typography variant="h6" component="span" sx={{ mx: 2 }}>
              {quantity}
            </Typography>
            <IconButton
              onClick={handleIncrease}
              size="small"
              sx={{
                color: theme.palette.mode === 'light' ? '#000' : '#fff',
              }}
            >
              <AddCircleOutline />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default CartItem;