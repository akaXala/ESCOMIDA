import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });
    }
    const { id_alimento } = await req.json();
    if (!id_alimento) {
      return NextResponse.json({ success: false, error: "Falta id_alimento" }, { status: 400 });
    }

    const deleteQuery = `DELETE FROM Favorito WHERE id = $1 AND id_alimento = $2`;
    await pool.query(deleteQuery, [userId, id_alimento]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
};