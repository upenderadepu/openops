import { DataSource } from 'typeorm';
import { commonProperties } from './database-connection';

export const createSqlLiteDataSource = (): DataSource => {
  return new DataSource({
    type: 'sqlite',
    database: ':memory:',
    ...commonProperties,
  });
};
