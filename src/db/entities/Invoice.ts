import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";
import { Client } from "./Client";
import { Project } from "./Project";
import { InvoiceItem } from "./InvoiceItem";
import type { InvoiceStatus } from "@/lib/types";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  invoiceNumber!: string;

  @Column({ type: "uuid" })
  clientId!: string;

  @ManyToOne(() => Client, (client) => client.invoices)
  client!: Relation<Client>;

  @Column({ type: "varchar", nullable: true })
  customClient?: string;

  @Column({ type: "uuid", nullable: true })
  projectId?: string;

  @ManyToOne(() => Project, (project) => project.invoices, { nullable: true })
  project?: Relation<Project>;

  @Column({ type: "varchar", nullable: true })
  customProject?: string;

  @Column({ type: "varchar" })
  currency!: string;

  @Column({
    type: "enum",
    enum: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"],
    default: "Draft",
  })
  status!: InvoiceStatus;

  @Column({ type: "varchar" })
  issueDate!: string;

  @Column({ type: "varchar", nullable: true })
  dueDate?: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  taxRate!: number;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items!: Relation<InvoiceItem[]>;

  @Column({ type: "varchar" })
  created!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
