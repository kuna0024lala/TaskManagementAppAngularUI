import { TaskItem } from "./task-item.model";

export interface TaskResponse {
    TotalPages: number;
    PageNumber: number;
    PageSize: number;
    taskItems: TaskItem[];
  }
  