import { Award } from "../types/Award";

export enum OperationType {
  UPDATE = "UPDATE",
  INSERT = "INSERT",
}

export type Payload = {
  operationType: OperationType;
  new: string;
  old?: string;
};
