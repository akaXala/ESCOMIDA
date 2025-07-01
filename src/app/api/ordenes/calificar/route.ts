import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: Request) => {
  try {
    const { userId }: { userId: string | null } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });
    }
    const body = await req.json();
    // body: [{ id_alimento, puntuacion, comentario }]
    if (!Array.isArray(body)) {
      return NextResponse.json({ success: false, error: "Formato inválido" }, { status: 400 });
    }
    for (const calificacion of body) {
      const { id_alimento, puntuacion, comentario } = calificacion;
      if (!id_alimento || !puntuacion) {
        continue;
      }
      await pool.query(
        `INSERT INTO reseña (puntuacion, comentario, id_alimento, id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id_alimento, id)
         DO UPDATE SET puntuacion = EXCLUDED.puntuacion, comentario = EXCLUDED.comentario`,
        [puntuacion, comentario, id_alimento, userId]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al calificar alimentos:", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
};
