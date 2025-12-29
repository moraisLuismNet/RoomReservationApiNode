"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefactorReservation1766434568215 = void 0;
class RefactorReservation1766434568215 {
    constructor() {
        this.name = "RefactorReservation1766434568215";
    }
    async up(queryRunner) {
        // 0. Drop dependent Foreign Keys
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_bc853f0988834b4c93dfaeb6250"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9"`);
        await queryRunner.query(`ALTER TABLE "email_queues" DROP CONSTRAINT "FK_df75f096e0d58753f3341acf03c"`);
        // 1. Rename columns to preserve data
        await queryRunner.query(`ALTER TABLE "reservations" RENAME COLUMN "id" TO "reservation_id"`);
        await queryRunner.query(`ALTER TABLE "reservations" RENAME COLUMN "user_email" TO "email"`);
        // 2. Add reservation_date and copy from created_at
        await queryRunner.query(`ALTER TABLE "reservations" ADD "reservation_date" TIMESTAMP`);
        await queryRunner.query(`UPDATE "reservations" SET "reservation_date" = "created_at"`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "reservation_date" SET NOT NULL`);
        // 3. Drop unused columns
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "adults"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "children"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "special_requests"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "payment_status"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "payment_method"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "payment_details"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "updated_at"`);
        // 4. Update PK constraint
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "PK_da95cef71b617ac35dc5bcda243"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "PK_414a88401d7ab4ce981a69784bb" PRIMARY KEY ("reservation_id")`);
        // 5. Other generated changes (sequences)
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "room_types_roomTypeId_seq" OWNED BY "room_types"."roomTypeId"`);
        await queryRunner.query(`ALTER TABLE "room_types" ALTER COLUMN "roomTypeId" SET DEFAULT nextval('"room_types_roomTypeId_seq"')`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "reservation_statuses_status_id_seq" OWNED BY "reservation_statuses"."status_id"`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ALTER COLUMN "status_id" SET DEFAULT nextval('"reservation_statuses_status_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ALTER COLUMN "status_id" DROP DEFAULT`);
        // 6. Re-add Foreign Keys with new column names
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_b094159ca937d12cd3c9d199466" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9" FOREIGN KEY ("status_id") REFERENCES "reservation_statuses"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("roomTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_queues" ADD CONSTRAINT "FK_df75f096e0d58753f3341acf03c" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("reservation_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_b094159ca937d12cd3c9d199466"`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ALTER COLUMN "status_id" SET DEFAULT nextval('reservation_statuses_id_seq')`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ALTER COLUMN "status_id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "reservation_statuses_status_id_seq"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9" FOREIGN KEY ("status_id") REFERENCES "reservation_statuses"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_types" ALTER COLUMN "roomTypeId" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "room_types_roomTypeId_seq"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("roomTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "reservation_date"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "PK_414a88401d7ab4ce981a69784bb"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "reservation_id"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "user_email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "payment_details" text`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "payment_method" character varying(50)`);
        await queryRunner.query(`CREATE TYPE "public"."reservations_payment_status_enum" AS ENUM('pending', 'paid', 'refunded', 'partially_refunded', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "payment_status" "public"."reservations_payment_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "total_amount" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "special_requests" text`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "children" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "adults" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_bc853f0988834b4c93dfaeb6250" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.RefactorReservation1766434568215 = RefactorReservation1766434568215;
