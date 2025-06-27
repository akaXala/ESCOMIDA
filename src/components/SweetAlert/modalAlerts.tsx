import Swal, { SweetAlertIcon } from 'sweetalert2';

// Función reutilizable para mostrar alertas personalizables
export async function mostrarAlerta(
  titulo: string,
  texto?: string,
  textoBoton?: string,
  icono?: SweetAlertIcon // Admite los tipos de iconos: 'success', 'error', 'warning', 'info', 'question'
): Promise<void> {
  await Swal.fire({
    title: titulo, // Título del mensaje
    text: texto || '', // Texto opcional
    icon: icono || 'info', // Icono personalizable (por defecto 'info')
    confirmButtonText: textoBoton || 'OK', // Texto del botón de confirmación
  });
}