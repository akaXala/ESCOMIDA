import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();  // Obtenemos los datos

        const { categoria } = body; // Creamos el cuerpo

        // Validamos el campo necesario
        if (!categoria) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // Escribimos la query
        const query = `
            SELECT id_alimento, nombre, precio, calorias, imagen 
            FROM alimento 
            WHERE categoria = $1
        `;

        // Valores
        const values = [categoria];

        // Realizamos la query
        const result = await pool.query(query, values);

        // Retorna los resultados como JSON
        return NextResponse.json(
            { success: true, data: result.rows },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error en la consulta: ", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}