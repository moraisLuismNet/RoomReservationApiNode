"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefactorRoomAndRoomType1766425267994 = void 0;
class RefactorRoomAndRoomType1766425267994 {
    constructor() {
        this.name = "RefactorRoomAndRoomType1766425267994";
    }
    async up(queryRunner) {
        // Drop FKs
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_4af5055a871c46d011345a255a6"`);
        // Create new tables
        await queryRunner.query(`CREATE TABLE "email_queues" ("id" SERIAL NOT NULL, "toEmail" character varying(255) NOT NULL, "subject" character varying(255) NOT NULL, "body" text NOT NULL, "emailType" character varying(50) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "attempts" integer NOT NULL DEFAULT '0', "maxAttempts" integer NOT NULL DEFAULT '3', "scheduledSendTime" TIMESTAMP NOT NULL, "sentAt" TIMESTAMP, "errorMessage" character varying(1000) NOT NULL DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "reservation_id" integer, "metadata" text, CONSTRAINT "PK_02de1b69020fd0799a22bb3774a" PRIMARY KEY ("id"))`);
        // Users changes
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        // RoomTypes Renames (Fixes FK dependency issue)
        await queryRunner.query(`ALTER TABLE "room_types" RENAME COLUMN "id" TO "roomTypeId"`);
        await queryRunner.query(`ALTER TABLE "room_types" RENAME COLUMN "name" TO "room_type_name"`);
        await queryRunner.query(`ALTER TABLE "room_types" RENAME COLUMN "base_price" TO "price_per_night"`);
        await queryRunner.query(`ALTER TABLE "room_types" RENAME COLUMN "max_occupancy" TO "capacity"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP COLUMN "amenities"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP COLUMN "image_url"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "room_types" RENAME CONSTRAINT "PK_b6e1d0a9b67d4b9fbff9c35ab69" TO "PK_fd96c1c66550ec37374c80812ba"`);
        await queryRunner.query(`ALTER TABLE "room_types" RENAME CONSTRAINT "UQ_20180102ff8f034e54c5812f695" TO "UQ_2c87c083f1e97eedee4c0a943df"`);
        // Rooms Renames
        await queryRunner.query(`ALTER TABLE "rooms" RENAME COLUMN "id" TO "roomId"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "floor"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "features"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "rooms" RENAME CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" TO "PK_31962cf242c2fdc6889493d9a99"`);
        // Reservations changes
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "user_email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "number_of_guests" integer NOT NULL DEFAULT '1'`);
        // Add new columns
        await queryRunner.query(`ALTER TABLE "rooms" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "image_room" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_97672ac88f789774dd47f7c8be3" PRIMARY KEY ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        // Add foreign keys
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_bc853f0988834b4c93dfaeb6250" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_queues" ADD CONSTRAINT "FK_df75f096e0d58753f3341acf03c" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "email_queues" DROP CONSTRAINT "FK_df75f096e0d58753f3341acf03c"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_bc853f0988834b4c93dfaeb6250"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "image_room"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "PK_31962cf242c2fdc6889493d9a99"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "roomId"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "number_of_guests"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "user_email"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP COLUMN "capacity"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP COLUMN "price_per_night"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP CONSTRAINT "UQ_2c87c083f1e97eedee4c0a943df"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP COLUMN "room_type_name"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP CONSTRAINT "PK_fd96c1c66550ec37374c80812ba"`);
        await queryRunner.query(`ALTER TABLE "room_types" DROP COLUMN "roomTypeId"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "features" text`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "description" text`);
        await queryRunner.query(`CREATE TYPE "public"."rooms_status_enum" AS ENUM('available', 'occupied', 'maintenance', 'reserved')`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "status" "public"."rooms_status_enum" NOT NULL DEFAULT 'available'`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "floor" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD "image_url" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD "amenities" text`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD "max_occupancy" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD "base_price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD CONSTRAINT "UQ_20180102ff8f034e54c5812f695" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_types" ADD CONSTRAINT "PK_b6e1d0a9b67d4b9fbff9c35ab69" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "email_queues"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_4af5055a871c46d011345a255a6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.RefactorRoomAndRoomType1766425267994 = RefactorRoomAndRoomType1766425267994;
