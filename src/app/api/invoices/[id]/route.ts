import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getDataSource } from "@/db/data-source";
import { Invoice } from "@/db/entities/Invoice";
import { InvoiceItem } from "@/db/entities/InvoiceItem";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { items, ...invoiceData } = body;
    const ds = await getDataSource();
    const repo = ds.getRepository(Invoice);
    const itemRepo = ds.getRepository(InvoiceItem);
    
    // First, update basic invoice fields
    await repo.update(id, invoiceData);
    
    // If items are provided, replace them (simple approach for this studio manager)
    if (items) {
      await itemRepo.delete({ invoiceId: id });
      const newItems = items.map((item: any) => 
        itemRepo.create({
          ...item,
          invoiceId: id,
          qty: Number(item.qty),
          rate: Number(item.rate)
        })
      );
      await itemRepo.save(newItems);
    }
    
    const updated = await repo.findOne({ 
      where: { id },
      relations: ["items"]
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("API Error (Invoices PUT):", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ds = await getDataSource();
    const repo = ds.getRepository(Invoice);
    
    await repo.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error (Invoices DELETE):", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
