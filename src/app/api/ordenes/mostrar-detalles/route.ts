import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database"; // Conexión a PostgreSQL

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { id_pedido } = body;

        // Validamos los campos necesaior

        // Creamos la query
        const query = `
            SELECT id_item, categoria, nombre, ingredientes_obligatorios, salsa, extra, ingredientes_opcionales, precio, imagen, cantidad, id_original, precio_final
            FROM item 
            WHERE id_pedido = $1
        `;

        // Escribimos los valores
        const values = [id_pedido];

        // Realizamos la query
        const result = await pool.query(query, values);

        // Regresamos los resultados como JSON
        return NextResponse.json(
            { success: true, data: result.rows },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error en obtener los items:", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );       
    }
};