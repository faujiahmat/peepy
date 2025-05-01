import { Status } from '@prisma/client';

export type TodoType = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
