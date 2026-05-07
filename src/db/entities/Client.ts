import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  type Relation,
} from "typeorm";
import { Project } from "./Project";
import { Invoice } from "./Invoice";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", nullable: true })
  company?: string;

  @Column({ type: "varchar", nullable: true })
  email?: string;

  @Column({ type: "varchar", nullable: true })
  phone?: string;

  @Column({ type: "varchar", nullable: true })
  location?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "varchar" })
  created!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Project, (project) => project.client)
  projects!: Relation<Project[]>;

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices!: Relation<Invoice[]>;
}
