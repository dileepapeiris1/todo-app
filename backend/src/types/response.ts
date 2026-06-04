/** Todo object returned in API responses. */
export interface TodoResponse {
  _id: string;
  title: string;
  description: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}
