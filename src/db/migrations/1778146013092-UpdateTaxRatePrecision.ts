import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaxRatePrecision1778146013092 implements MigrationInterface {
    name = 'UpdateTaxRatePrecision1778146013092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "taxRate" TYPE numeric(12,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "taxRate" TYPE numeric(5,2)`);
    }

}
