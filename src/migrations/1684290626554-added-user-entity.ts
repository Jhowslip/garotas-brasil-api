import { MigrationInterface, QueryRunner } from "typeorm";

export class addedUserEntity1684290626554 implements MigrationInterface {
    name = 'addedUserEntity1684290626554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" ADD "rank" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "rank"`);
    }

}
