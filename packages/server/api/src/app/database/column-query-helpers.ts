import { QueryRunner } from 'typeorm';

export async function dropTableColumn(
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
) {
  await queryRunner.query(
    `ALTER TABLE "${tableName}" DROP COLUMN IF EXISTS "${columnName}";`,
  );
}

export async function addTableColumn(
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
  columnType: string,
) {
  await queryRunner.query(
    `ALTER TABLE "${tableName}" ADD COLUMN IF NOT EXISTS "${columnName}" "${columnType}";`,
  );
}
