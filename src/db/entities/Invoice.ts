import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";
import type { InvoiceStatus } from "@/lib/types";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  invoiceNumber!: string;

  @Column()
  clientId!: string;

  @ManyToOne("Client", "invoices")
  client!: Relation<unknown>;

  @Column({ nullable: true })
  customClient?: string;

  @Column({ nullable: true })
  projectId?: string;

  @ManyToOne("Project", "invoices", { nullable: true })
  project?: Relation<unknown>;

  @Column({ nullable: true })
  customProject?: string;

  @Column()
  currency!: string;

  @Column({
    type: "enum",
    enum: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"],
    default: "Draft",
  })
  status!: InvoiceStatus;

  @Column()
  issueDate!: string;

  @Column({ nullable: true })
  dueDate?: string;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  taxRate!: number;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @OneToMany("InvoiceItem", "invoice", { cascade: true })
  items!: Relation<unknown[]>;

  @Column()
  created!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
