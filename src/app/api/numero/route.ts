import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export async function POST(request: Request) {
  try {
    const { userId }: { userId: string | null } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Inicia sesión." },
        { status: 401 }
      );
    }
    const { numero } = await request.json();
    if (!numero || !/^\d{10}$/.test(numero)) {
      return NextResponse.json(
        { success: false, error: "Número inválido." },
        { status: 400 }
      );
    }
    // Verifica si ya tiene número
    const checkQuery = `SELECT telefono FROM usuario WHERE id = $1;`;
    const checkResult = await pool.query(checkQuery, [userId]);
    if (checkResult.rows.length > 0 && checkResult.rows[0].numero) {
      // Ya tiene número, no lo agregues de nuevo
      return NextResponse.json({ success: true, alreadyExists: true }, { status: 200 });
    }
    // Inserta el número
    const updateQuery = `UPDATE usuario SET telefono = $1 WHERE id = $2;`;
    await pool.query(updateQuery, [numero, userId]);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error al agregar el número:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
