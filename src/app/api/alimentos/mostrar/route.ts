import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();  // Obtenemos los datos

        const { id_alimento } = body; // Creamos el cuerpo

        // Validamos el campo necesario
        if (!id_alimento) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // Escribimos la query
        const query = `
            SELECT *
            FROM alimento 
            WHERE id_alimento = $1
        `

        // Valores
        const values = [id_alimento];

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