import { Static, Type } from '@sinclair/typebox';
import { BaseModelSchema } from '../common';

export enum WorkerMachineStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum WorkerMachineType {
  DEDICATED = 'DEDICATED',
  SHARED = 'SHARED',
}

export const MachineInformation = Type.Object({
  cpuUsagePercentage: Type.Number(),
  ramUsagePercentage: Type.Number(),
  totalAvailableRamInBytes: Type.Number(),
  ip: Type.String(),
});
export type MachineInformation = Static<typeof MachineInformation>;

export const WorkerMachine = Type.Object({
  ...BaseModelSchema,
  type: Type.Enum(WorkerMachineType),
  information: MachineInformation,
});

export type WorkerMachine = Static<typeof WorkerMachine>;

export const WorkerMachineWithStatus = Type.Composite([
  WorkerMachine,
  Type.Object({
    status: Type.Enum(WorkerMachineStatus),
  }),
]);

export type WorkerMachineWithStatus = Static<typeof WorkerMachineWithStatus>;

export const WorkerMachineHealthcheckRequest = MachineInformation;

export type WorkerMachineHealthcheckRequest = Static<
  typeof WorkerMachineHealthcheckRequest
>;
