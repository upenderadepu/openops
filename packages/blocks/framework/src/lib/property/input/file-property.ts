import { Type } from '@sinclair/typebox';
import { ValidationInputType } from '../../validators/types';
import { BasePropertySchema, TPropertyValue } from './common';
import { PropertyType } from './property-type';

export class WorkflowFile {
  constructor(
    public filename: string,
    public data: Buffer,
    public extension?: string,
  ) {}

  get base64(): string {
    return this.data.toString('base64');
  }
}

export const FileProperty = Type.Composite([
  BasePropertySchema,
  TPropertyValue(Type.Unknown(), PropertyType.FILE),
]);

export type FileProperty<R extends boolean> = BasePropertySchema &
  TPropertyValue<WorkflowFile, PropertyType.FILE, ValidationInputType.FILE, R>;
