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
import { Task } from "./Task";
import { Invoice } from "./Invoice";
import type { ProjectStatus } from "@/lib/types";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "uuid" })
  clientId!: string;

  @ManyToOne(() => Client, (client) => client.projects)
  client!: Relation<Client>;

  @Column({
    type: "enum",
    enum: ["Discovery", "In Progress", "Review", "Delivered", "Archived"],
    default: "Discovery",
  })
  status!: ProjectStatus;

  @Column({ type: "varchar" })
  serviceType!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  budget!: number;

  @Column({ type: "varchar" })
  currency!: string;

  @Column({ type: "varchar", nullable: true })
  deadline?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar" })
  created!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Relation<Task[]>;

  @OneToMany(() => Invoice, (invoice) => invoice.project)
  invoices!: Relation<Invoice[]>;
}
