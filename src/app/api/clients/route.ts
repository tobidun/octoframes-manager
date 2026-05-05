import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getDataSource } from "@/db/data-source";
import { Client } from "@/db/entities/Client";

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Client);
    const clients = await repo.find({
      order: { createdAt: "DESC" },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("API Error (Clients GET):", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Client);
    
    const client = repo.create({
      ...body,
      created: new Date().toISOString().split("T")[0],
    });
    
    await repo.save(client);
    return NextResponse.json(client);
  } catch (error) {
    console.error("API Error (Clients POST):", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
