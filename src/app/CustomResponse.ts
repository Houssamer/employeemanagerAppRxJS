import { Employee } from './Employee';
export interface CustomResponse {
  appData: Employee[];
  error?: string;
}
