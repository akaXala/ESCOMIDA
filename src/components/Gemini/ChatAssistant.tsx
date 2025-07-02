// src/components/ChatAssistant.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, IconButton, useTheme, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const ChatAssistant = () => {
  const theme = useTheme(); // Hook para acceder al tema de MUI
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ role: string, parts: { text: string }[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // Efecto para hacer scroll hacia el último mensaje
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newHistory = [...history, { role: 'user', parts: [{ text: message }] }];
    setHistory(newHistory);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          // Enviamos solo el historial relevante para no exceder límites de tokens
          history: newHistory.slice(0, -1) 
        }),
      });

      if (!res.ok) throw new Error('Respuesta no fue OK');

      const data = await res.json();
      const modelMessage = { role: 'model', parts: [{ text: data.response }] };
      
      setHistory(prev => [...prev, modelMessage]);

    } catch (error) {
      const errorMessage = { role: 'model', parts: [{ text: "Lo siento, hubo un error al conectar. Intenta de nuevo." }] };
      setHistory(prev => [...prev, errorMessage]);
      console.error("Error al enviar mensaje:", error);
    } finally {
      setLoading(false);
    }
  };

  // Estilos del botón flotante
  const fabStyle = {
    position: 'fixed',
    bottom: { xs: 80, sm: 30 }, // Más arriba en móvil para no chocar con la nav
    right: { xs: 20, sm: 30 },
    // Un z-index alto para estar sobre otros elementos
    zIndex: theme.zIndex.drawer + 2, 
    backgroundColor: theme.palette.mode === 'light' ? '#0334BA' : '#91a8fd',
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'light' ? '#0044ff' : '#6C84DB',
    }
  };

  // Estilos de la ventana de chat
  const chatWindowStyle = {
    position: 'fixed',
    bottom: { xs: 0, sm: 20 },
    right: { xs: 0, sm: 20 },
    width: { xs: '100%', sm: 370 },
    height: { xs: '100%', sm: 550 },
    maxHeight: { xs: '100vh', sm: 'calc(100vh - 40px)'},
    zIndex: theme.zIndex.drawer + 2, // Mismo z-index para consistencia
    display: 'flex',
    flexDirection: 'column',
    borderRadius: { xs: 0, sm: '12px' },
    boxShadow: '0px 10px 25px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    // Usamos los colores de fondo de tu tema
    bgcolor: 'background.paper' 
  };

  if (!isOpen) {
    return (
      <IconButton onClick={() => setIsOpen(true)} sx={fabStyle} aria-label="Abrir chat">
        <ChatIcon />
      </IconButton>
    );
  }

  return (
    <Paper sx={chatWindowStyle}>
      {/* Cabecera del Chat */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" fontWeight="bold">Asistente ESCOMIDA</Typography>
        <IconButton onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
          <CloseIcon sx={{ color: 'text.primary' }}/>
        </IconButton>
      </Box>

      {/* Cuerpo del Chat (Mensajes) */}
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
        {history.map((entry, index) => (
          <Box key={index} sx={{
            mb: 1.5,
            display: 'flex',
            justifyContent: entry.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <Paper sx={{
              p: 1.5,
              borderRadius: '10px',
              bgcolor: entry.role === 'user' ? (theme.palette.mode === 'light' ? '#0334BA' : '#91a8fd') : (theme.palette.mode === 'light' ? '#f0f0f0' : '#333'),
              color: entry.role === 'user' ? '#fff' : 'text.primary',
              maxWidth: '85%'
            }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                 {entry.parts[0].text}
              </Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
             <CircularProgress size={24} />
          </Box>
        )}
        <div ref={chatEndRef} />
      </Box>

      {/* Input para escribir mensaje */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center' }}>
        <TextField 
          fullWidth 
          variant="outlined" 
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
          placeholder="Escribe tu duda..."
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
            },
          }}
        />
        <IconButton onClick={handleSendMessage} disabled={loading} color="primary" sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatAssistant;