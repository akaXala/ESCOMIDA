import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

interface OptionsProps {
  texto: string;
  srcImagen: string;
  onClick?: () => void;
}

function Options({ texto, srcImagen, onClick }: OptionsProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1, // Espacio entre el ícono y el texto
        cursor: onClick ? 'pointer' : 'default', // Cambia el cursor si es clickeable
      }}
    >
      {/* El Avatar actúa como el contenedor circular */}
      <Avatar
        alt={texto}
        src={srcImagen}
        sx={{
          width: 100, // Ajusta el tamaño del círculo
          height: 100
        }}
      />
      
      {/* El texto personalizable */}
      <Typography variant="body2" component="span" fontWeight="medium">
        {texto}
      </Typography>
    </Box>
  );
};

export default Options;