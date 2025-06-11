// components/ImageCarousel.tsx
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Box, Typography } from '@mui/material';
import Link from 'next/link';

// Define la estructura de cada elemento del carrusel
interface CarouselItemProps {
  name: string;
  description: string;
  imgSrc: string;
  href: string;
}

// Datos de ejemplo para el carrusel
const items: CarouselItemProps[] = [
  {
    name: 'Nuevas exquisitas hamburguesas',
    description: '¡La mejor hamburguesa que probarás!',
    imgSrc: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop', // Imagen de ejemplo 1
    href: '/ofertas/premium',
  },
  {
    name: 'Nuevas Pizzas en el Menú',
    description: '¡2x1 todos los martes!',
    imgSrc: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=2112&auto=format&fit=crop', // Imagen de ejemplo 2
    href: '/menu/pizzas',
  },
  {
    name: 'Postres que Enamoran',
    description: 'Descubre nuestra nueva selección',
    imgSrc: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1980&auto=format&fit=crop', // Imagen de ejemplo 3
    href: '/menu/postres',
  },
];

function ImageCarousel() {
  return (
    <Box
      sx={{
        maxWidth: '95%',
        margin: '40px auto',
        borderRadius: 6,
        overflow: 'hidden',
        // Responsive: en móvil, reduce el ancho y el radio
        '@media (max-width:600px)': {
          maxWidth: '95vw',
          borderRadius: 3,
        },
      }}
    >
      <Carousel
        animation="slide"
        navButtonsAlwaysVisible={true}
        indicatorContainerProps={{
          style: {
            marginTop: '-40px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          },
        }}
        navButtonsProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: '#fff',
            borderRadius: '50%',
          },
        }}
      >
        {items.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </Carousel>
    </Box>
  );
}

// Componente para renderizar cada diapositiva
function Item({ item }: { item: CarouselItemProps }) {
  return (
    <Link href={item.href} passHref style={{ textDecoration: 'none' }}>
      <Paper
        elevation={10}
        sx={{
          position: 'relative',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          backgroundImage: `url(${item.imgSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          borderRadius: 6, // Esquinas redondeadas
          '&:hover': {
            transform: 'scale(1.02)',
          },
          // Responsive: en móvil, reduce el radio y la altura
          '@media (max-width:600px)': {
            borderRadius: 3,
            height: '220px',
          },
        }}
      >
        {/* Overlay oscuro para mejorar la legibilidad del texto */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajusta la opacidad aquí
          }}
        />

        {/* Contenedor del texto */}
        <Box
          sx={{
            position: 'relative', // Para que el texto esté sobre el overlay
            zIndex: 1,
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <Typography variant="h2" component="h2" fontWeight="bold">
            {item.name}
          </Typography>
          <Typography variant="h5" component="p" sx={{ mt: 1 }}>
            {item.description}
          </Typography>
        </Box>
      </Paper>
    </Link>
  );
}

export default ImageCarousel;