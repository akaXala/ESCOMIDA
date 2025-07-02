"use client";

import { useState, FormEvent } from 'react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const [toNumber, setToNumber] = useState('');
  const [param1, setParam1] = useState(''); // Para {{1}}: Nombre del cliente
  const [param2, setParam2] = useState(''); // Para {{2}}: Número de pedido
  const [param3, setParam3] = useState(''); // Para {{3}}: Nuevo estado
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('Enviando...');

    // Creamos el array de parámetros en el orden correcto
    const parameters = [param1, param2, param3];

    try {
      const res = await fetch('/api/whatsapp/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          to: toNumber, 
          parameters: parameters // Enviamos el array de parámetros
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('✅ ¡Mensaje enviado con éxito!');
        // Limpiar formulario tras el envío exitoso
        setToNumber('');
        setParam1('');
        setParam2('');
        setParam3('');
      } else {
        // Mostramos un error más detallado si la API lo proporciona
        const errorMessage = data.error?.error_data?.details || data.message || 'Error desconocido';
        setStatus(`❌ Error al enviar el mensaje: ${errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ Error en la solicitud. Revisa la consola del navegador.');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Enviar Plantilla de WhatsApp</h1>
      <p>Usa este formulario para enviar la plantilla <strong>actualizacion_estado_producto</strong>.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="toNumber" style={{ display: 'block', marginBottom: '5px' }}>Número de Destino (con cód. de país)</label>
          <input
            id="toNumber"
            type="tel"
            value={toNumber}
            onChange={(e) => setToNumber(e.target.value)}
            placeholder="Ej: 5215512345678"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="param1" style={{ display: 'block', marginBottom: '5px' }}>Nombre del Cliente ("{1}")</label>
          <input
            id="param1"
            type="text"
            value={param1}
            onChange={(e) => setParam1(e.target.value)}
            placeholder="Arath"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="param2" style={{ display: 'block', marginBottom: '5px' }}>Número de Pedido ("{2}")</label>
          <input
            id="param2"
            type="text"
            value={param2}
            onChange={(e) => setParam2(e.target.value)}
            placeholder="12"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="param3" style={{ display: 'block', marginBottom: '5px' }}>Nuevo Estado del Pedido ("{3}")</label>
          <input
            id="param3"
            type="text"
            value={param3}
            onChange={(e) => setParam3(e.target.value)}
            placeholder="Entregado"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', border: 'none', backgroundColor: '#25D366', color: 'white', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
          Enviar Mensaje
        </button>
      </form>

      {status && <p style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>{status}</p>}
    </div>
  );
};

export default Home;