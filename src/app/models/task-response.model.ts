import { TaskItem } from "./task-item.model";

export interface TaskResponse {
    totalPages: number;
    pageNumber: number;
    pagesize: number;
    taskItems: TaskItem[];
  }
  