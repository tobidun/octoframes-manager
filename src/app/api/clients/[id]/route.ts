import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getDataSource } from "@/db/data-source";
import { Client } from "@/db/entities/Client";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Client);
    
    await repo.update(id, body);
    const updated = await repo.findOneBy({ id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("API Error (Clients PUT):", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ds = await getDataSource();
    const repo = ds.getRepository(Client);
    
    await repo.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error (Clients DELETE):", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
