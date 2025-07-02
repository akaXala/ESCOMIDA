import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const PATCH = async (req: NextRequest) => {
    try {
        const { id_pedido, nuevo_estado } = await req.json();
        if (!id_pedido || !nuevo_estado) {
            return NextResponse.json({ success: false, error: "Faltan datos" }, { status: 400 });
        }
        // Validar estados permitidos
        const estados = ["En espera", "Preparando", "Listo para recoger", "Entregado"];
        if (!estados.includes(nuevo_estado)) {
            return NextResponse.json({ success: false, error: "Estado no válido" }, { status: 400 });
        }
        // 1. Actualizar el estado
        await pool.query(
            "UPDATE pedidos SET estatus = $1 WHERE id_pedido = $2",
            [nuevo_estado, id_pedido]
        );
        // 2. Obtener datos del pedido y usuario
        const pedidoRes = await pool.query("SELECT id, id_pedido FROM pedidos WHERE id_pedido = $1", [id_pedido]);
        if (pedidoRes.rowCount === 0) {
            return NextResponse.json({ success: false, error: "Pedido no encontrado" }, { status: 404 });
        }
        const userId = pedidoRes.rows[0].id;
        // Obtener teléfono y nombre
        const usuarioRes = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/usuario?id=${userId}`);
        const usuarioData = await usuarioRes.json();
        const telefono = usuarioData?.data?.telefono;
        const nombre = usuarioData?.data?.nombre || "Usuario";
        if (!telefono) {
            return NextResponse.json({ success: false, error: "El usuario no tiene teléfono registrado" }, { status: 400 });
        }
        // 3. Enviar mensaje por WhatsApp
        await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/whatsapp/send-message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: `52${telefono}`,
                parameters: [nombre, String(id_pedido), nuevo_estado]
            })
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error al cambiar el estado del pedido:", error);
        return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
    }
};
