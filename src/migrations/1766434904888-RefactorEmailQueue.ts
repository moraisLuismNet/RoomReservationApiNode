import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorEmailQueue1766434904888 implements MigrationInterface {
    name = 'RefactorEmailQueue1766434904888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_queues" RENAME COLUMN "id" TO "email_queue_id"`);
        await queryRunner.query(`ALTER TABLE "email_queues" RENAME CONSTRAINT "PK_02de1b69020fd0799a22bb3774a" TO "PK_e2df50f08ef5aa7888c60f03542"`);
        await queryRunner.query(`ALTER SEQUENCE "email_queues_id_seq" RENAME TO "email_queues_email_queue_id_seq"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "reservation_statuses_status_id_seq" OWNED BY "reservation_statuses"."status_id"`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ALTER COLUMN "status_id" SET DEFAULT nextval('"reservation_statuses_status_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "email_queues" DROP CONSTRAINT "FK_df75f096e0d58753f3341acf03c"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "reservations_reservation_id_seq" OWNED BY "reservations"."reservation_id"`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "reservation_id" SET DEFAULT nextval('"reservations_reservation_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "reservation_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9" FOREIGN KEY ("status_id") REFERENCES "reservation_statuses"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_queues" ADD CONSTRAINT "FK_df75f096e0d58753f3341acf03c" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("reservation_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_queues" DROP CONSTRAINT "FK_df75f096e0d58753f3341acf03c"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9"`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "reservation_id" SET DEFAULT nextval('reservations_id_seq')`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "reservation_id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "reservations_reservation_id_seq"`);
        await queryRunner.query(`ALTER TABLE "email_queues" ADD CONSTRAINT "FK_df75f096e0d58753f3341acf03c" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("reservation_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ALTER COLUMN "status_id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "reservation_statuses_status_id_seq"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9" FOREIGN KEY ("status_id") REFERENCES "reservation_statuses"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER SEQUENCE "email_queues_email_queue_id_seq" RENAME TO "email_queues_id_seq"`);
        await queryRunner.query(`ALTER TABLE "email_queues" RENAME CONSTRAINT "PK_e2df50f08ef5aa7888c60f03542" TO "PK_02de1b69020fd0799a22bb3774a"`);
        await queryRunner.query(`ALTER TABLE "email_queues" RENAME COLUMN "email_queue_id" TO "id"`);
    }

}
