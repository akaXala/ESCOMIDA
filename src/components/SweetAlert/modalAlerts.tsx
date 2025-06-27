import Swal, { SweetAlertIcon } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Función reutilizable para mostrar alertas personalizables
export async function mostrarAlerta(
  titulo: string,
  texto?: string,
  textoBoton?: string,
  icono?: SweetAlertIcon,
  modo?: 'dark' | 'light'
): Promise<void> {
  const isDark = modo
    ? modo === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

  await Swal.fire({
    title: titulo, // Título del mensaje
    text: texto || '', // Texto opcional
    icon: icono || 'info', // Icono personalizable (por defecto 'info')
    confirmButtonText: textoBoton || 'OK', // Texto del botón de confirmación
    background: isDark ? '#18181b' : '#fff', // Fondo según modo
    color: isDark ? '#f4f4f5' : '#18181b', // Texto según modo
    confirmButtonColor: '#2563eb', // Botón azul en ambos modos
    customClass: {
      popup: isDark ? 'dark-swal-popup' : 'light-swal-popup',
      title: isDark ? 'dark-swal-title' : 'light-swal-title',
      confirmButton: isDark ? 'dark-swal-confirm' : 'light-swal-confirm',
    },
  });
}