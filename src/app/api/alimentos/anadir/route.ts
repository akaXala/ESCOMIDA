import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();  // Obtenemos el cuerpo de la petición
        const { userId }: { userId: string | null } = await auth(); // Obtenemos el ID del usuario
        
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

        // Creamos el cuerpo
        const {
            categoria,
            nombre,
            ingredientes_obligatorios,
            salsa,
            extra,
            ingredientes_opcionales,
            precio,
            imagen,
            cantidad,
            id_original,
        } = body;

        // Validamos los campos necesarios
        if (!categoria || !nombre || !ingredientes_obligatorios || !precio || !imagen || !cantidad || !id_original) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // Verificamos si el item ya existe en el carrito (todos los campos relevantes deben coincidir)
        const checkQuery = `
            SELECT id_item, cantidad FROM item WHERE
                categoria = $1 AND
                nombre = $2 AND
                ingredientes_obligatorios = $3 AND
                salsa IS NOT DISTINCT FROM $4 AND
                extra IS NOT DISTINCT FROM $5 AND
                ingredientes_opcionales IS NOT DISTINCT FROM $6 AND
                precio = $7 AND
                imagen = $8 AND
                id_original = $9 AND
                id_carrito = $10
            LIMIT 1
        `;
        const checkValues = [
            categoria,
            nombre,
            ingredientes_obligatorios,
            salsa,
            extra,
            ingredientes_opcionales,
            precio,
            imagen,
            id_original,
            id_carrito,
        ];
        const existingItem = await pool.query(checkQuery, checkValues);

        if ((existingItem && existingItem.rowCount && existingItem.rowCount > 0)) {
            // Si existe, actualizamos la cantidad (stack)
            const id_item = existingItem.rows[0].id_item;
            const nuevaCantidad = existingItem.rows[0].cantidad + cantidad;
            const updateQuery = `UPDATE item SET cantidad = $1 WHERE id_item = $2`;
            await pool.query(updateQuery, [nuevaCantidad, id_item]);
            return NextResponse.json(
                { success: true, stacked: true },
                { status: 200 }
            );
        } else {
            // Si no existe, lo insertamos como nuevo
            const insertQuery = `
                INSERT INTO item (
                    categoria,
                    nombre,
                    ingredientes_obligatorios,
                    salsa,
                    extra,
                    ingredientes_opcionales,
                    precio,
                    imagen,
                    cantidad,
                    id_original,
                    id_carrito
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `;
            const insertValues = [
                categoria,
                nombre,
                ingredientes_obligatorios,
                salsa,
                extra,
                ingredientes_opcionales,
                precio,
                imagen,
                cantidad,
                id_original,
                id_carrito,
            ];
            await pool.query(insertQuery, insertValues);
            return NextResponse.json(
                { success: true, stacked: false },
                { status: 201 }
            );
        }
    } catch (error) {
        // Error al agregar al carrito
        console.error("Error en al agregar al producto: ", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}