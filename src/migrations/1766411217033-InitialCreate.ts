import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCreate1766411217033 implements MigrationInterface {
    name = 'InitialCreate1766411217033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "first_name" character varying(50), "last_name" character varying(50), "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "is_active" boolean NOT NULL DEFAULT true, "last_login" TIMESTAMP, "reset_password_token" character varying, "reset_password_expires" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_types" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "description" text, "base_price" numeric(10,2) NOT NULL, "max_occupancy" integer NOT NULL, "amenities" text, "image_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_20180102ff8f034e54c5812f695" UNIQUE ("name"), CONSTRAINT "PK_b6e1d0a9b67d4b9fbff9c35ab69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_statuses_name_enum" AS ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show', 'completed')`);
        await queryRunner.query(`CREATE TABLE "reservation_statuses" ("id" SERIAL NOT NULL, "name" "public"."reservation_statuses_name_enum" NOT NULL, "description" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_928a7beb4ffbdae133933b28f7c" UNIQUE ("name"), CONSTRAINT "PK_3419b68921db15fcaf470421297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reservations_payment_status_enum" AS ENUM('pending', 'paid', 'refunded', 'partially_refunded', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "room_id" integer NOT NULL, "status_id" integer NOT NULL, "check_in_date" date NOT NULL, "check_out_date" date NOT NULL, "adults" integer NOT NULL DEFAULT '1', "children" integer NOT NULL DEFAULT '0', "special_requests" text, "total_amount" numeric(10,2) NOT NULL, "payment_status" "public"."reservations_payment_status_enum" NOT NULL DEFAULT 'pending', "payment_method" character varying(50), "payment_details" text, "cancellation_date" TIMESTAMP, "cancellation_reason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."rooms_status_enum" AS ENUM('available', 'occupied', 'maintenance', 'reserved')`);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" SERIAL NOT NULL, "room_number" character varying(10) NOT NULL, "floor" integer NOT NULL, "status" "public"."rooms_status_enum" NOT NULL DEFAULT 'available', "room_type_id" integer NOT NULL, "description" text, "features" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8f7c6fa4c469bab1a06fe3e49fe" UNIQUE ("room_number"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_4af5055a871c46d011345a255a6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9" FOREIGN KEY ("status_id") REFERENCES "reservation_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_8a380bdc519b8701daf0ec62da0"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_6aef3a04f7c96611e75d2db10fb"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_4af5055a871c46d011345a255a6"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_payment_status_enum"`);
        await queryRunner.query(`DROP TABLE "reservation_statuses"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_statuses_name_enum"`);
        await queryRunner.query(`DROP TABLE "room_types"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
