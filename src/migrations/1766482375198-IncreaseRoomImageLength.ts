import { MigrationInterface, QueryRunner } from "typeorm";

export class IncreaseRoomImageLength1766482375198 implements MigrationInterface {
    name = 'IncreaseRoomImageLength1766482375198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_queues" DROP CONSTRAINT "FK_df75f096e0d58753f3341acf03c"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "reservations_reservation_id_seq" OWNED BY "reservations"."reservation_id"`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "reservation_id" SET DEFAULT nextval('"reservations_reservation_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "image_room"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "image_room" character varying(2048)`);
        await queryRunner.query(`ALTER TABLE "email_queues" ADD CONSTRAINT "FK_df75f096e0d58753f3341acf03c" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("reservation_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_queues" DROP CONSTRAINT "FK_df75f096e0d58753f3341acf03c"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "image_room"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "image_room" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "reservation_id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "reservations_reservation_id_seq"`);
        await queryRunner.query(`ALTER TABLE "email_queues" ADD CONSTRAINT "FK_df75f096e0d58753f3341acf03c" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("reservation_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
