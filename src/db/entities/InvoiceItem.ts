import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation } from "typeorm";

@Entity("invoice_items")
export class InvoiceItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  qty!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  rate!: number;

  @Column()
  invoiceId!: string;

  @ManyToOne("Invoice", "items", { onDelete: "CASCADE" })
  invoice!: Relation<unknown>;
}
