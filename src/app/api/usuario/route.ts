import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";
import pool from "@/config/database";

export async function GET(request: Request) {
  try {
    // Obtener el id desde query si existe, si no, usar el del auth
    const url = new URL(request.url);
    const idFromQuery = url.searchParams.get("id");
    let userId: string | null = idFromQuery;
    if (!userId) {
      const authResult = await auth();
      userId = authResult.userId;
    }
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Inicia sesión." },
        { status: 401 }
      );
    }
    // Buscar usuario en la base de datos
    const query = `SELECT * FROM usuario WHERE id = $1;`;
    const values = [userId];
    let result = await pool.query(query, values);
    if (result.rowCount === 0) {
      const insertQuery = `INSERT INTO usuario (id) VALUES ($1);`;
      await pool.query(insertQuery, values);
      const createCart = `INSERT INTO carrito (id) VALUES ($1)`;
      await pool.query(createCart, values);
    }
    // Obtener datos de Clerk
    let nombre = null;
    try {
      const user = await clerkClient.users.getUser(userId);
      if (user) {
        nombre =
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username || user.emailAddresses?.[0]?.emailAddress || user.id;
      }
    } catch {}
    // Devuelve success y los datos del usuario
    return NextResponse.json(
      { success: true, data: { ...result.rows[0], nombre } },
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