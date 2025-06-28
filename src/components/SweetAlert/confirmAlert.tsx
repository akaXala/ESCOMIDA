import Swal, { SweetAlertIcon } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export async function mostrarConfirmacion(
  titulo: string,
  texto?: string,
  textoConfirmar?: string,
  textoCancelar?: string,
  icono?: SweetAlertIcon,
  modo?: 'dark' | 'light'
): Promise<boolean> {
  const isDark = modo
    ? modo === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

  const result = await Swal.fire({
    title: titulo,
    text: texto || '',
    icon: icono || 'question',
    showCancelButton: true,
    confirmButtonText: textoConfirmar || 'Sí',
    cancelButtonText: textoCancelar || 'No',
    background: isDark ? '#18181b' : '#fff',
    color: isDark ? '#f4f4f5' : '#18181b',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#d32f2f',
    customClass: {
      popup: isDark ? 'dark-swal-popup' : 'light-swal-popup',
      title: isDark ? 'dark-swal-title' : 'light-swal-title',
      confirmButton: isDark ? 'dark-swal-confirm' : 'light-swal-confirm',
      cancelButton: isDark ? 'dark-swal-cancel' : 'light-swal-cancel',
    },
  });
  return result.isConfirmed;
}
