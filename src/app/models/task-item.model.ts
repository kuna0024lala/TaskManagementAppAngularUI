export interface TaskItem {
    id: number;
    title: string;
    description?: string;
    dueDate?: Date;
    assignedTo: string;
    isCompleted: boolean;
    isSelected?:boolean;
  }
  