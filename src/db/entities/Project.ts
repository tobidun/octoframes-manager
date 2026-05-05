import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";
import type { ProjectStatus } from "@/lib/types";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  clientId!: string;

  @ManyToOne("Client", "projects")
  client!: Relation<unknown>;

  @Column({
    type: "enum",
    enum: ["Discovery", "In Progress", "Review", "Delivered", "Archived"],
    default: "Discovery",
  })
  status!: ProjectStatus;

  @Column()
  serviceType!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  budget!: number;

  @Column()
  currency!: string;

  @Column({ nullable: true })
  deadline?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column()
  created!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany("Task", "project")
  tasks!: Relation<unknown[]>;

  @OneToMany("Invoice", "project")
  invoices!: Relation<unknown[]>;
}
