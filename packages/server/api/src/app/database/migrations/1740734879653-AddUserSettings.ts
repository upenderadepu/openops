import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserSettings1740734879653 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user_settings" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "userId" character varying NOT NULL,
                "projectId" character varying NOT NULL,
                "organizationId" character varying NOT NULL,
                "settings" jsonb NOT NULL,
                CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "idx_user_settings_composite" ON "user_settings" ("userId", "projectId", "organizationId")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_settings"
            ADD CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_settings"
            ADD CONSTRAINT "FK_4f91fe5b13c92158be7809cb278" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_settings"
            ADD CONSTRAINT "FK_f78a7efca7db1f24467417f6933" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('Not implemented');
  }
}
