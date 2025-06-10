import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Define las propiedades que el componente recibirá
interface DishCardProps {
  nombrePlatillo: string;
  precio: number;
  calorias: number;
}

const DishCard: React.FC<DishCardProps> = ({ nombrePlatillo, precio, calorias }) => {
  // Genera una URL de imagen aleatoria basada en el nombre del platillo para consistencia
  const randomImage = `https://picsum.photos/seed/${nombrePlatillo}/400/300`;

  return (
    <Card sx={{ maxWidth: 345, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <CardMedia
        component="img"
        height="200"
        image={randomImage}
        alt={`Imagen de ${nombrePlatillo}`}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
          {nombrePlatillo}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 1 }}>
          <Typography variant="body2" component="p">
            {`$${precio.toFixed(2)}`}
          </Typography>
          <Box component="span" sx={{ mx: 1 }}>•</Box>
          <Typography variant="body2" component="p">
            {`${calorias} kcal`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DishCard;