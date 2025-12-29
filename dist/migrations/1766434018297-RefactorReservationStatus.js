"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefactorReservationStatus1766434018297 = void 0;
class RefactorReservationStatus1766434018297 {
    constructor() {
        this.name = "RefactorReservationStatus1766434018297";
    }
    async up(queryRunner) {
        // 0. Drop dependent Foreign Keys explicitly
        // FK_11b07d4d4900ef6ca2f9db171a9 is reservations(status_id) -> reservation_statuses(id)
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9"`);
        // 1. Rename id to status_id to preserve data
        await queryRunner.query(`ALTER TABLE "reservation_statuses" RENAME COLUMN "id" TO "status_id"`);
        // 2. Rename the sequence to match standard naming (optional but good)
        // await queryRunner.query(`ALTER SEQUENCE "reservation_statuses_id_seq" RENAME TO "reservation_statuses_status_id_seq"`);
        // 3. Drop unused columns
        await queryRunner.query(`ALTER TABLE "reservation_statuses" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" DROP COLUMN "updated_at"`);
        // 4. Update PK constraint (if name changed or needed) - TypeORM dropped PK_341... and added PK_46d...
        // Since we renamed, the PK constraint on 'id' is now on 'status_id' automatically in Postgres,
        // but the constraint name might be old. Let's align with TypeORM expectations.
        await queryRunner.query(`ALTER TABLE "reservation_statuses" DROP CONSTRAINT "PK_3419b68921db15fcaf470421297"`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ADD CONSTRAINT "PK_46d51b19a35d6594afbce4d5a1b" PRIMARY KEY ("status_id")`);
        // 5. Other generated changes (sequences etc from other tables)
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "room_types_roomTypeId_seq" OWNED BY "room_types"."roomTypeId"`);
        await queryRunner.query(`ALTER TABLE "room_types" ALTER COLUMN "roomTypeId" SET DEFAULT nextval('"room_types_roomTypeId_seq"')`);
        await queryRunner.query(`ALTER TABLE "room_types" ALTER COLUMN "roomTypeId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "rooms_roomId_seq" OWNED BY "rooms"."roomId"`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "roomId" SET DEFAULT nextval('"rooms_roomId_seq"')`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb" FOREIGN KEY ("room_id") REFERENCES "rooms"("roomId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("roomTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // 6. Restore reservation status FK
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9" FOREIGN KEY ("status_id") REFERENCES "reservation_statuses"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb"`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "roomId" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "rooms_roomId_seq"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb" FOREIGN KEY ("room_id") REFERENCES "rooms"("roomId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_types" ALTER COLUMN "roomTypeId" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "room_types_roomTypeId_seq"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("roomTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" DROP CONSTRAINT "PK_46d51b19a35d6594afbce4d5a1b"`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" DROP COLUMN "status_id"`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ADD "description" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation_statuses" ADD CONSTRAINT "PK_3419b68921db15fcaf470421297" PRIMARY KEY ("id")`);
    }
}
exports.RefactorReservationStatus1766434018297 = RefactorReservationStatus1766434018297;
