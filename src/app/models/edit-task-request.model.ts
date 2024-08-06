

export interface EditTaskRequest {
    id: number;
    title: string;
    description?: string;
    dueDate?: Date;
    assignedTo: string;
    isCompleted: boolean;
    taskItems?: any;
  }
  