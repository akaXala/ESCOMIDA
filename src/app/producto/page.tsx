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
  CssBaseline,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

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
  const themeMode = prefersDarkMode ? 'dark' : 'light';

  // Parametros de busqueda
  const searchParams = useSearchParams();
  const id_alimento = searchParams.get('id');

  const borderColor = (themeMode === 'light') ? '#0044ff' : '#91a8fd';
  const borderHoverColor = (themeMode === 'light') ? '#0334BA' : '#6C84DB';
  const borderFocusedColor = (themeMode === 'light') ? '#0334BA' : '#6C84DB';

  const [requiredIngredients, setRequiredIngredients] = React.useState<Ingredient[]>([]);
  const [optionalIngredients, setOptionalIngredients] = React.useState<Ingredient[]>([]);

  // Estado para los datos del alimento
  const [alimento, setAlimento] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  // Estados para salsa y extras
  const [salsas, setSalsas] = React.useState<string[]>([]);
  const [selectedSalsa, setSelectedSalsa] = React.useState<string>('');
  const [extras, setExtras] = React.useState<string[]>([]);
  const [selectedExtra, setSelectedExtra] = React.useState<string>('');

  React.useEffect(() => {
    if (!id_alimento) return;
    setLoading(true);
    fetch('/api/alimentos/mostrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_alimento }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setAlimento(data.data[0]);
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
            setOptionalIngredients([]);
          }

          // Salsas
          if (data.data[0].salsa) {
            const salsasArr = data.data[0].salsa.split(',').map((s: string) => s.trim());
            setSalsas(salsasArr);
            setSelectedSalsa(salsasArr[0] || '');
          } else {
            setSalsas([]);
            setSelectedSalsa('');
          }
          // Extras
          if (data.data[0].extra) {
            const extrasArr = data.data[0].extra.split(',').map((e: string) => e.trim());
            setExtras(extrasArr);
            setSelectedExtra(extrasArr[0] || '');
          } else {
            setExtras([]);
            setSelectedExtra('');
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id_alimento]);

  const handleOptionalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptionalIngredients(
      optionalIngredients.map((ingredient) =>
        ingredient.id === event.target.name
          ? { ...ingredient, checked: event.target.checked }
          : ingredient
      )
    );
  };

  const addCart = async () => {
    if (!alimento) return;

    // Construye los campos requeridos por el endpoint
    const payload = {
      categoria: alimento.categoria,
      nombre: alimento.nombre,
      ingredientes_obligatorios: requiredIngredients.map(i => i.label).join(','),
      salsa: salsas.length > 0 ? selectedSalsa : '',
      extra: extras.length > 0 ? selectedExtra : '',
      ingredientes_opcionales: optionalIngredients.filter(i => i.checked).map(i => i.label).join(','),
      precio: alimento.precio,
      imagen: alimento.imagen,
      cantidad: 1, // O el valor que desees
      id_original: alimento.id_alimento,
    };

    try {
      const response = await fetch("/api/alimentos/anadir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        // Opcional: muestra un mensaje de éxito o redirige
        alert("Producto añadido al carrito");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error al añadir producto");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Box sx={{ width: '100wh', height: '100vh', py: { xs: 2, md: 5 }, px: { xs: 2, md: 4 } }}>
        {/* Sección superior: Imagen y Título */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component="img"
            src={alimento?.imagen}
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
          <Typography
            variant="body2"
            component="h1"
          >
            {alimento?.descripcion}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Contenedor de Grid para las columnas de ingredientes */}
        <Grid container spacing={{ xs: 2, md: 4 }} textAlign="center">
          {/* Columna Izquierda: Ingredientes Obligatorios */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: { xs: 'center', md: 'center' }, // Cambiado a 'center' en xs y md
                width: '100%',
              }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1, width: {md: 'fit-content'}, textAlign: { xs: 'center', md: 'left' } }}>
                Ingredientes obligatorios
              </Typography>
              <FormGroup sx={{ width: { xs: '100%', md: 'fit-content' }, alignItems: { xs: 'center', md: 'flex-start' } }}>
                {requiredIngredients.map((ingredient) => (
                  <FormControlLabel
                    key={ingredient.id}
                    control={
                      <Checkbox 
                        checked 
                        disabled
                        icon={<CheckBoxOutlineBlankIcon sx={{ color: borderColor }} />}
                        checkedIcon={<CheckBoxIcon sx={{ color: borderColor }} />}
                      />
                    }
                    label={ingredient.label}
                  />
                ))}
              </FormGroup>
              {/* Selector de salsa si existe */}
              {salsas.length > 0 && (
                <FormControl sx={{ mt: 2, minWidth: 180, width: { xs: '100%', md: 180 } }}>
                  <InputLabel id="salsa-label">Salsa</InputLabel>
                  <Select
                    labelId="salsa-label"
                    value={selectedSalsa}
                    label="Salsa"
                    onChange={e => setSelectedSalsa(e.target.value)}
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: borderColor,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: borderHoverColor,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: borderFocusedColor,
                      },
                    }}
                  >
                    {salsas.map((salsa, idx) => (
                      <MenuItem key={idx} value={salsa}>{salsa}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Grid>

          {/* Divider solo en móvil antes de ingredientes opcionales */}
          <Grid size={12} sx={{ display: { xs: 'block', md: 'none' }, my: 2 }}>
            <Divider />
          </Grid>

          {/* Columna Derecha: Ingredientes Opcionales */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: { xs: 'center', md: 'center' }, // Cambiado a 'center' en xs y md
                width: '100%',
              }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1, width: {md: 'fit-content'}, textAlign: { xs: 'center', md: 'left' } }}>
                Ingredientes opcionales
              </Typography>
              <FormGroup sx={{ width: { xs: '100%', md: 'fit-content' }, alignItems: { xs: 'center', md: 'flex-start' } }}>
                {(alimento?.ingredientes_opcionales === null || optionalIngredients.length === 0) && extras.length === 0 ? (
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
                          icon={<CheckBoxOutlineBlankIcon sx={{ color: borderColor }} />}
                          checkedIcon={<CheckBoxIcon sx={{ color: borderColor }} />}
                        />
                      }
                      label={ingredient.label}
                    />
                  ))
                )}
              </FormGroup>
              {/* Selector de extras si existe */}
              {extras.length > 0 && (
                <FormControl sx={{ mt: 2, minWidth: 180, width: { xs: '100%', md: 180 } }}>
                  <InputLabel id="extras-label">Extra</InputLabel>
                  <Select
                    labelId="extras-label"
                    value={selectedExtra}
                    label="Extra"
                    onChange={e => setSelectedExtra(e.target.value)}
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: borderColor,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: borderHoverColor,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: borderFocusedColor,
                      },
                    }}
                  >
                    <MenuItem value="Sin extra">Sin extra</MenuItem>
                    {extras.map((extra, idx) => (
                      <MenuItem key={idx} value={extra}>{extra}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
                bgcolor: borderColor,
            }}
            onClick={addCart} // <-- Agrega el handler aquí
            >
              Añadir producto
            </Button>
        </Box>
        </Box>
    </ThemeProvider>
    
  );
}