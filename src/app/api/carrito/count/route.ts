import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/config/database"; // Conexión a PostgreSQL

export const GET = async () => {
  try {
    const { userId }: { userId: string | null } = await auth(); // Obtenemos el ID del user
    
    // Buscamos el carrito
    const carritoQuery = `SELECT id_carrito FROM carrito WHERE id = $1 LIMIT 1`;
    const carritoResult = await pool.query(carritoQuery, [userId]);
    if (carritoResult.rowCount === 0) {
        return NextResponse.json(
            { success: false, error: "No se encontró un carrito para el usuario." },
            { status: 404 }
        );
    }
    const id_carrito = carritoResult.rows[0].id_carrito;

    // Creamos la query
    const query = `SELECT COUNT(*) FROM item where id_carrito = $1`;

    // Escribimos los valores
    const values = [id_carrito];

    // Realizamos la query
    const result = await pool.query(query, values);

    const count = parseInt(result.rows[0].count, 10);

    return NextResponse.json(
      { success: true, count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en obtener usuarios:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
};