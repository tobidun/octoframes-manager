import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getDataSource } from "@/db/data-source";
import { Invoice } from "@/db/entities/Invoice";
import { InvoiceItem } from "@/db/entities/InvoiceItem";

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Invoice);
    const invoices = await repo.find({
      relations: ["items"],
      order: { createdAt: "DESC" },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("API Error (Invoices GET):", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, ...invoiceData } = body;
    const ds = await getDataSource();
    const repo = ds.getRepository(Invoice);
    
    const invoice = repo.create({
      ...invoiceData,
      created: new Date().toISOString().split("T")[0],
      items: items.map((item: any) => ({
        ...item,
        qty: Number(item.qty),
        rate: Number(item.rate)
      }))
    });
    
    await repo.save(invoice);
    return NextResponse.json(invoice);
  } catch (error) {
    console.error("API Error (Invoices POST):", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
