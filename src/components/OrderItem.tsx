// components/OrderItem.tsx

import React from 'react';
import { Avatar, Box, Typography, Stack } from '@mui/material';

// 1. INTERFAZ ACTUALIZADA: Añadimos 'price' y 'currencySymbol'
interface OrderItemProps {
  image?: string; // Hacemos la imagen opcional para poder usar iniciales también
  initial?: string; // Inicial para el Avatar si no hay imagen
  title: string;
  category: string;
  quantity: string | number;
  ingredientes_obligatorios: string[];
  salsas?: string[];
  extras?: string[];
  ingredientes_opcionales?: string[];
  price: number;
  final_price: number,
  currencySymbol?: string; // Símbolo de moneda opcional, por defecto '$'
}

const OrderItem: React.FC<OrderItemProps> = ({
  image,
  initial,
  title,
  category,
  quantity,
  ingredientes_obligatorios,
  salsas,
  extras,
  ingredientes_opcionales,
  price,
  final_price,
  currencySymbol = '$',
}) => {
    // 4. LÓGICA PARA COMBINAR INGREDIENTES
    const allIngredients = [
        ...ingredientes_obligatorios,
        ...(ingredientes_opcionales || []),
    ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        p: 2,
        backgroundColor: '#1e1e2f',
        borderRadius: 2,
        width: '100%', // Abarca todo el ancho disponible
        color: '#ffffff',
      }}
    >
      {/* Avatar Cuadrado */}
      <Avatar
        variant="rounded"
        src={image}
        sx={{
          bgcolor: '#4a4a6a',
          width: 56,
          height: 56,
          mr: 2,
          fontSize: '1.5rem',
        }}
      >
        {/* Muestra la inicial si no hay imagen */}
        {!image && initial}
      </Avatar>

      {/* Contenedor principal de texto, ocupa el espacio restante */}
      <Stack direction="column" sx={{ flexGrow: 1, overflow: 'hidden', width: '100%' }}>

        {/* 2. SECCIÓN SUPERIOR: Título a la izquierda, Precio a la derecha */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          
          {/* Columna Izquierda: Título y Categoría */}
          <Stack direction="column" sx={{ maxWidth: 'calc(100% - 100px)' }}>
            <Typography variant="h6" component="div" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#c0bacc' }}>
              {category}
            </Typography>
          </Stack>

          {/* Columna Derecha: Precio y Descripción */}
          <Stack direction="column" alignItems="flex-end" sx={{ minWidth: '90px' }}> {/* Ancho mínimo para el precio */}
            <Typography variant="h6" component="div" fontWeight="bold" noWrap>
              {`${currencySymbol}${final_price.toFixed(2)}`}
            </Typography>
            <Typography variant="caption" sx={{ color: '#c0bacc' }}>
              Precio total
            </Typography>
          </Stack>
        </Stack>

        {/* 3. SECCIÓN INFERIOR: Detalles del platillo */}
        <Box sx={{ mt: 1 }}> {/* Margen superior para separar de la sección de arriba */}
          <Typography variant="body2">
            Cantidad: {quantity}
          </Typography>
          <Typography variant="body2">
            Precio unitario: {`${currencySymbol}${price.toFixed(2)}`}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Box component="span" sx={{ fontWeight: 'bold' }}>
              Ingredientes:
            </Box>{' '}
            {allIngredients.join(', ')}
          </Typography>
          {Array.isArray(salsas) && salsas.filter(s => s && s.trim() !== '').length > 0 && (
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 'bold' }}>
                Salsas:
              </Box>{' '}
              {salsas.join(', ')}
            </Typography>
          )}
          {Array.isArray(extras) && extras.filter(e => e && e.trim() !== '').length > 0 && (
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 'bold' }}>
                Extras:
              </Box>{' '}
              {extras.join(', ')}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default OrderItem;