import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInvoiceAmount1778407854479 implements MigrationInterface {
    name = 'AddInvoiceAmount1778407854479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" ADD "amount" numeric(12,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "amount"`);
    }

}
