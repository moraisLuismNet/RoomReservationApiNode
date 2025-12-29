"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefactorUser1766433695405 = void 0;
class RefactorUser1766433695405 {
    constructor() {
        this.name = "RefactorUser1766433695405";
    }
    async up(queryRunner) {
        // 1. Add new columns (initially nullable)
        await queryRunner.query(`ALTER TABLE "users" ADD "full_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" character varying(20)`);
        // 2. Data Migration
        await queryRunner.query(`UPDATE "users" SET "full_name" = "username", "password_hash" = "password"`);
        // 3. Apply NOT NULL constraints
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "full_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL`);
        // 4. Drop old columns
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_password_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_password_expires"`);
        // 5. Other generated changes
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "room_types_roomTypeId_seq" OWNED BY "room_types"."roomTypeId"`);
        await queryRunner.query(`ALTER TABLE "room_types" ALTER COLUMN "roomTypeId" SET DEFAULT nextval('"room_types_roomTypeId_seq"')`);
        await queryRunner.query(`ALTER TABLE "room_types" ALTER COLUMN "roomTypeId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "rooms_roomId_seq" OWNED BY "rooms"."roomId"`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "roomId" SET DEFAULT nextval('"rooms_roomId_seq"')`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "roomId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb" FOREIGN KEY ("room_id") REFERENCES "rooms"("roomId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("roomTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb"`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "roomId" SET DEFAULT nextval('rooms_id_seq')`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "roomId" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "rooms_roomId_seq"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb" FOREIGN KEY ("room_id") REFERENCES "rooms"("roomId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_types" ALTER COLUMN "roomTypeId" SET DEFAULT nextval('room_types_id_seq')`);
        await queryRunner.query(`ALTER TABLE "room_types" ALTER COLUMN "roomTypeId" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "room_types_roomTypeId_seq"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("roomTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_password_expires" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_password_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
    }
}
exports.RefactorUser1766433695405 = RefactorUser1766433695405;
