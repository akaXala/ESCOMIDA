"use client";

import * as React from 'react';
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Divider,
  Grid,
  CssBaseline
} from '@mui/material';
// Para el tema
import { ThemeProvider, useMediaQuery } from '@mui/material';

// Para extraer parametros
import { useSearchParams } from 'next/navigation';

// Importa el tema custom
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// La interfaz para los ingredientes no cambia
interface Ingredient {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
}

export default function Home() {
  // Detecta si el sistema está en dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

  // Parametros de busqueda
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [requiredIngredients, setRequiredIngredients] = React.useState<Ingredient[]>([]);

  const [optionalIngredients, setOptionalIngredients] = React.useState<Ingredient[]>([]);

  // Estado para los datos del alimento
  const [alimento, setAlimento] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch('/api/alimentos/mostrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setAlimento(data.data[0]);
          console.log("Respuesta alimento:", data.data[0]); // <-- Agrega esto
          // Si quieres poblar ingredientes desde la respuesta, hazlo aquí
          // Por ejemplo, si los ingredientes vienen en un string separados por coma:
          if (data.data[0].ingredientes_obligatorios) {
            const ingredientes = data.data[0].ingredientes_obligatorios.split(',').map((ing: string, idx: number) => ({
              id: `ing_${idx}`,
              label: ing.trim(),
              checked: true,
              disabled: true,
            }));
            setRequiredIngredients(ingredientes);
          }
          if (data.data[0].ingredientes_opcionales) {
            const opcionales = data.data[0].ingredientes_opcionales.split(',').map((ing: string, idx: number) => ({
              id: `opt_${idx}`,
              label: ing.trim(),
              checked: false,
            }));
            setOptionalIngredients(opcionales);
          } else {
            setOptionalIngredients([]); // Vacía si es null
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleOptionalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptionalIngredients(
      optionalIngredients.map((ingredient) =>
        ingredient.id === event.target.name
          ? { ...ingredient, checked: event.target.checked }
          : ingredient
      )
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Box sx={{ width: '100wh', height: '100vh', py: { xs: 2, md: 5 }, px: { xs: 2, md: 4 } }}>
        {/* Sección superior: Imagen y Título */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component="img"
            src="/mocha-cookie-crumble.jpeg"
            alt={alimento?.nombre || "Imagen"}
            sx={{
              width: { xs: 120, md: 150 },
              height: { xs: 120, md: 150 },
              borderRadius: '50%',
              objectFit: 'cover',
              mx: 'auto',
              mb: 2
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 'bold' }}
          >
            {alimento?.nombre}
          </Typography>
          <Typography
            variant="overline"
            component="h1"
          >
            ${alimento?.precio} • {alimento?.calorias} kcal 
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Contenedor de Grid para las columnas de ingredientes */}
        <Grid container spacing={{ xs: 2, md: 4 }}>
            
          {/* Columna Izquierda: Ingredientes Obligatorios */}
          <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              // Centra el contenido de la columna en desktop
              alignItems: { xs: 'flex-start', md: 'center' } 
          }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1, width: {md: 'fit-content'} }}>
              Ingredientes obligatorios
              </Typography>
              <FormGroup sx={{ width: {md: 'fit-content'} }}>
              {requiredIngredients.map((ingredient) => (
                  <FormControlLabel
                  key={ingredient.id}
                  control={<Checkbox checked disabled />}
                  label={ingredient.label}
                  />
              ))}
              </FormGroup>
          </Box>
          </Grid>

          {/* Columna Derecha: Ingredientes Opcionales */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: { xs: 'flex-start', md: 'center' } 
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1, width: {md: 'fit-content'} }}>
                Ingredientes opcionales
                </Typography>
                <FormGroup sx={{ width: {md: 'fit-content'} }}>
                {alimento?.ingredientes_opcionales === null || optionalIngredients.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No hay opciones para personalizar
                  </Typography>
                ) : (
                  optionalIngredients.map((ingredient) => (
                    <FormControlLabel
                      key={ingredient.id}
                      control={
                          <Checkbox
                          checked={ingredient.checked}
                          onChange={handleOptionalChange}
                          name={ingredient.id}
                          />
                      }
                      label={ingredient.label}
                    />
                  ))
                )}
                </FormGroup>
            </Box>
          </Grid>
        </Grid>
        
        {/* Sección del Botón */}
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
            <Button
            variant="contained"
            size="large"
            sx={{
                py: 1.5,
                px: 8,
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '50px',
            }}
            >
            Add
            </Button>
        </Box>
        </Box>
    </ThemeProvider>
    
  );
}