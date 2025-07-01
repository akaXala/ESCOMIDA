import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Rating,
  TextField,
  Box,
  Typography,
  Avatar,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Interfaces (sin cambios)
interface Alimento {
  id_alimento: number;
  nombre: string;
  imagen: string;
}

interface RateModalProps {
  alimentos: Alimento[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (results: { id_alimento: number; puntuacion: number; comentario: string }[]) => void;
}

const RateModal: React.FC<RateModalProps> = ({ alimentos, isOpen, onClose, onSubmit }) => {
  const [current, setCurrent] = useState(0);
  // El estado ahora maneja la puntuación como un 'number | null' para compatibilidad con MUI Rating
  const [ratings, setRatings] = useState<{ puntuacion: number | null; comentario: string }[]>([]);

  useEffect(() => {
    if (isOpen && alimentos.length > 0) {
      // Inicializa las puntuaciones. MUI Rating funciona bien con null como valor vacío.
      setRatings(alimentos.map(() => ({ puntuacion: null, comentario: '' })));
      setCurrent(0);
    }
  }, [isOpen, alimentos]);

  if (!isOpen || alimentos.length === 0) {
    return null;
  }

  const handleRatingChange = (newValue: number | null) => {
    setRatings(prevRatings =>
      prevRatings.map((r, i) => (i === current ? { ...r, puntuacion: newValue } : r))
    );
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setRatings(prevRatings =>
      prevRatings.map((r, i) => (i === current ? { ...r, comentario: newComment } : r))
    );
  };

  const handleNext = () => {
    if (current < alimentos.length - 1) {
      setCurrent(current + 1);
    } else {
      // Filtra y mapea los resultados para asegurar que la puntuación no sea null
      const finalResults = alimentos.map((a, i) => ({
        id_alimento: a.id_alimento,
        puntuacion: ratings[i].puntuacion || 0, // Convierte null a 0 en el envío
        comentario: ratings[i].comentario,
      }));
      onSubmit(finalResults);
    }
  };

  const alimento = alimentos[current];
  const rating = ratings[current] || { puntuacion: null, comentario: '' };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="span">Califica tu Comida</Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Stack direction="column" alignItems="center" spacing={2}>
          <Avatar
            src={alimento.imagen}
            alt={alimento.nombre}
            sx={{ width: 100, height: 100, mb: 1 }}
          />
          <Typography variant="h5" component="h2" fontWeight="bold">
            {alimento.nombre}
          </Typography>
          <Rating
            name="food-rating"
            value={rating.puntuacion}
            onChange={(event, newValue) => handleRatingChange(newValue)}
            size="large"
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Escribe un comentario (opcional)"
            variant="outlined"
            value={rating.comentario}
            onChange={handleCommentChange}
            sx={{ mt: 2 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleNext}
          disabled={rating.puntuacion === null || rating.puntuacion === 0}
          size="large"
        >
          {current < alimentos.length - 1 ? 'Siguiente' : 'Enviar Calificaciones'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateModal;