import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  type Relation,
} from "typeorm";
import { Project } from "./Project";
import type { TaskStatus, Priority } from "@/lib/types";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "uuid" })
  projectId!: string;

  @ManyToOne(() => Project, (project) => project.tasks)
  project!: Relation<Project>;

  @Column({
    type: "enum",
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  })
  status!: TaskStatus;

  @Column({
    type: "enum",
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Medium",
  })
  priority!: Priority;

  @Column({ type: "varchar", nullable: true })
  dueDate?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "varchar" })
  created!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
