import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define las rutas que pertenecen a una organización específica
const isOrgSpecificRoute = createRouteMatcher([
    //'/cocina(.*)',
    '/admin(.*)'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Obtener ID y Organización
  const { orgSlug } = await auth();

  const pathname = req.nextUrl.pathname;

  // Acceso administrador (todas las rutas)
  if (orgSlug === 'admin-1749479021') {
    return NextResponse.next();
  }

  // Acceso cocina (solo: /cocina)
  if (orgSlug === 'cocina-1749479043') {
    if (!pathname.startsWith('/cocina')) {
      return NextResponse.redirect(new URL('/cocina', req.url));
    }
    return NextResponse.next();
  }

  // Usuario normal
  if (isOrgSpecificRoute(req)) {  // Si quiere entrar a una protegida
      return NextResponse.redirect(new URL('/', req.url)); // Redirigir a la raíz
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};