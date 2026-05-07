import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation } from "typeorm";
import { Invoice } from "./Invoice";

@Entity("invoice_items")
export class InvoiceItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  qty!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  rate!: number;

  @Column({ type: "uuid" })
  invoiceId!: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: "CASCADE" })
  invoice!: Relation<Invoice>;
}
