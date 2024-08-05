export interface AddTaskRequest {
    title: string;
    description?: string;
    dueDate?: Date;
    assignedTo: string;
    isCompleted: boolean;
  }
  