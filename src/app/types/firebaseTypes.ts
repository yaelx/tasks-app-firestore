import { Timestamp } from "firebase/firestore";

export interface Task {
  id: string;
  uid: string;
  todo: string;
  description?: string;
  done: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  [x: string]: any;
}