import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';

// Define las propiedades que el componente recibirá
interface DishCardProps {
  id: number;
  nombrePlatillo: string;
  precio: number;
  calorias: number;
  imagen?: string;
}

const DishCard: React.FC<DishCardProps> = ({ id, nombrePlatillo, precio, calorias, imagen }) => {
  return (
    <Link href={`/producto?id=${id}`} style={{ textDecoration: 'none' }}>
      {/* CAMBIO 1: Se añade 'height' y se convierte la Card en un contenedor flex column */}
      <Card sx={{
        width: 345, // Usamos 'width' en lugar de 'maxWidth' para un tamaño fijo
        height: '100%', // La tarjeta ocupará toda la altura de su contenedor padre (ideal para grids)
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardMedia
          component="img"
          height="200" // Altura fija para todas las imágenes
          image={imagen}
          alt={`Imagen de ${nombrePlatillo}`}
          sx={{ objectFit: 'cover' }} // 'cover' asegura que la imagen llene el espacio sin deformarse
        />
        {/* CAMBIO 2: El CardContent también es flex y crecerá para llenar el espacio sobrante */}
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1 // Esta es la propiedad clave para que el contenido ocupe el espacio restante
        }}>
          {/* CAMBIO 3: Se reserva un espacio mínimo para el título para evitar saltos de altura */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              gutterBottom 
              variant="h6" 
              component="div" 
              fontWeight="bold"
              // Opcional pero recomendado: Limita el texto a 2 líneas y añade puntos suspensivos
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2, // Muestra un máximo de 2 líneas
                minHeight: '3rem' // Reserva espacio equivalente a ~2 líneas para consistencia
              }}
            >
              {nombrePlatillo}
            </Typography>
          </Box>
          
          {/* Este Box ya no necesita crecer, se posicionará al final gracias al flexGrow del Box de arriba */}
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
    </Link>
  );
};

export default DishCard;