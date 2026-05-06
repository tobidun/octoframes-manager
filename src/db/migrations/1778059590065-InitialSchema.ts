import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1778059590065 implements MigrationInterface {
    name = 'InitialSchema1778059590065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "company" character varying, "email" character varying, "phone" character varying, "location" character varying, "notes" text, "created" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('Discovery', 'In Progress', 'Review', 'Delivered', 'Archived')`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "clientId" uuid NOT NULL, "status" "public"."projects_status_enum" NOT NULL DEFAULT 'Discovery', "serviceType" character varying NOT NULL, "budget" numeric(10,2) NOT NULL, "currency" character varying NOT NULL, "deadline" character varying, "description" text, "created" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('To Do', 'In Progress', 'Done')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('Low', 'Medium', 'High', 'Urgent')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "projectId" uuid NOT NULL, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'To Do', "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'Medium', "dueDate" character varying, "notes" text, "created" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."invoices_status_enum" AS ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled')`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoiceNumber" character varying NOT NULL, "clientId" uuid NOT NULL, "customClient" character varying, "projectId" uuid, "customProject" character varying, "currency" character varying NOT NULL, "status" "public"."invoices_status_enum" NOT NULL DEFAULT 'Draft', "issueDate" character varying NOT NULL, "dueDate" character varying, "taxRate" numeric(5,2) NOT NULL DEFAULT '0', "notes" text, "created" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "qty" numeric(10,2) NOT NULL, "rate" numeric(10,2) NOT NULL, "invoiceId" uuid NOT NULL, CONSTRAINT "PK_53b99f9e0e2945e69de1a12b75a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_091f9433895a53408cb8ae3864f" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_d9df936180710f9968da7cf4a51" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_20d900c6b7f2de7faa4d214d64d" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_7fb6895fc8fad9f5200e91abb59" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_7fb6895fc8fad9f5200e91abb59"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_20d900c6b7f2de7faa4d214d64d"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_d9df936180710f9968da7cf4a51"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_091f9433895a53408cb8ae3864f"`);
        await queryRunner.query(`DROP TABLE "invoice_items"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
