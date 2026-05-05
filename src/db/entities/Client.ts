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

  @Column()
  name!: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column()
  created!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany("Project", "client")
  projects!: Relation<unknown[]>;

  @OneToMany("Invoice", "client")
  invoices!: Relation<unknown[]>;
}
