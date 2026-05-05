import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getDataSource } from "@/db/data-source";
import { Project } from "@/db/entities/Project";

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Project);
    const projects = await repo.find({
      order: { createdAt: "DESC" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("API Error (Projects GET):", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Project);
    
    const project = repo.create({
      ...body,
      created: new Date().toISOString().split("T")[0],
    });
    
    await repo.save(project);
    return NextResponse.json(project);
  } catch (error) {
    console.error("API Error (Projects POST):", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
