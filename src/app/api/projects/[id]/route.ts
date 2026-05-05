import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getDataSource } from "@/db/data-source";
import { Project } from "@/db/entities/Project";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Project);
    
    await repo.update(id, body);
    const updated = await repo.findOneBy({ id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("API Error (Projects PUT):", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ds = await getDataSource();
    const repo = ds.getRepository(Project);
    
    await repo.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error (Projects DELETE):", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
