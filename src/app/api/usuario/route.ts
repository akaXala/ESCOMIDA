import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export async function GET(request: Request) {
  try {
    const { userId }: { userId: string | null } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Inicia sesión." },
        { status: 401 }
      );
    }

    const query = `SELECT * FROM usuario WHERE id = $1;`;
    const values = [userId];
    let result = await pool.query(query, values);

    if (result.rowCount === 0) {
      const insertQuery = `INSERT INTO usuario (id) VALUES ($1);`;
      await pool.query(insertQuery, values);

      const createCart = `INSERT INTO carrito (id) VALUES ($1)`;
      await pool.query(createCart, values);

      return NextResponse.json(
        { success: true },
        { status: 201 }
      );
    }

    // Si ya existe, solo regresamos success
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error al obtener o registrar el usuario:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}