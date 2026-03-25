// Domain Types and DTOs

// Entity - Representa a tarefa no domínio
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// DTO - Para criar uma tarefa
export class CreateTaskDTO {
  title!: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' = 'medium';
  dueDate?: Date;
}

// DTO - Para atualizar uma tarefa
export class UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

// Response DTO
export class TaskResponseDTO {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.completed = task.completed;
    this.priority = task.priority;
    this.dueDate = task.dueDate;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
  }
}
