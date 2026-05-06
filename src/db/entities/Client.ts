import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  type Relation,
} from "typeorm";

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

  @OneToMany("Project", "client")
  projects!: Relation<unknown[]>;

  @OneToMany("Invoice", "client")
  invoices!: Relation<unknown[]>;
}
