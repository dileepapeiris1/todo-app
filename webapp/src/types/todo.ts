import type { ID, ISODateString } from '@/types/common';

/** A single task as returned by the API. */
export interface Todo {
  _id: ID;
  title: string;
  description: string;
  done: boolean;
  dueDate?: ISODateString;
  createdAt: ISODateString;
}
