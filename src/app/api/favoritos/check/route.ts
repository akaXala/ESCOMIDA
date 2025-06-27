import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, isFavorite: false }, { status: 200 });
    }
    const { id_alimento } = await req.json();
    if (!id_alimento) {
      return NextResponse.json({ success: false, isFavorite: false }, { status: 200 });
    }

    const selectQuery = `SELECT id_favorito FROM Favorito WHERE id = $1 AND id_alimento = $2 LIMIT 1`;
    const result = await pool.query(selectQuery, [userId, id_alimento]);
    if (result.rows.length > 0) {
      return NextResponse.json({ success: true, isFavorite: true, id_favorito: result.rows[0].id_favorito });
    } else {
      return NextResponse.json({ success: true, isFavorite: false });
    }
  } catch (error) {
    return NextResponse.json({ success: false, isFavorite: false }, { status: 200 });
  }
};