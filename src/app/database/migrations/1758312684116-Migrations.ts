import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1758312684116 implements MigrationInterface {
    name = 'Migrations1758312684116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."articles_status_enum" AS ENUM('draft', 'published', 'archived')`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "content" text NOT NULL, "status" "public"."articles_status_enum" NOT NULL DEFAULT 'draft', "tags" text, "publishedAt" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying, "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "fingerprint" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type_id" integer, "user_id" integer, CONSTRAINT "PK_9f236389174a6ccbd746f53dca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_tokens_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "need_encryption" boolean NOT NULL DEFAULT false, "lifetime" character varying, CONSTRAINT "PK_c9ac3d5dc365268a9327350c137" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_87bb15395540ae06337a486a77a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_tokens" ADD CONSTRAINT "FK_738bab0fdd60f3cdc41acd3d57b" FOREIGN KEY ("type_id") REFERENCES "users_tokens_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_tokens" ADD CONSTRAINT "FK_32f96022cc5076fe565a5cba20b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_tokens" DROP CONSTRAINT "FK_32f96022cc5076fe565a5cba20b"`);
        await queryRunner.query(`ALTER TABLE "users_tokens" DROP CONSTRAINT "FK_738bab0fdd60f3cdc41acd3d57b"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_87bb15395540ae06337a486a77a"`);
        await queryRunner.query(`DROP TABLE "users_tokens_types"`);
        await queryRunner.query(`DROP TABLE "users_tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TYPE "public"."articles_status_enum"`);
    }

}
