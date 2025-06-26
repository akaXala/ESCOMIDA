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

    // Intenta insertar, si ya existe el par, ignora (por restricción UNIQUE)
    const insertQuery = `
      INSERT INTO Favorito (id, id_alimento)
      VALUES ($1, $2)
      ON CONFLICT (id, id_alimento) DO NOTHING
      RETURNING id_favorito
    `;
    const result = await pool.query(insertQuery, [userId, id_alimento]);
    if (result.rows.length > 0) {
      return NextResponse.json({ success: true, id_favorito: result.rows[0].id_favorito });
    } else {
      // Ya existía, busca el id_favorito
      const selectQuery = `SELECT id_favorito FROM Favorito WHERE id = $1 AND id_alimento = $2 LIMIT 1`;
      const selectResult = await pool.query(selectQuery, [userId, id_alimento]);
      return NextResponse.json({ success: true, id_favorito: selectResult.rows[0]?.id_favorito });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
};