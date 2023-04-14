import { MigrationInterface, QueryRunner } from "typeorm";

export class addedUserEntity1680729135970 implements MigrationInterface {
    name = 'addedUserEntity1680729135970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "cidade" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "estado" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "estado"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cidade"`);
    }

}
