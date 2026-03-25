// @ts-nocheck
// Example: CreateTaskService

import type { ITaskRepository } from '../../domain/interfaces/ITaskRepository.js';
import type { CreateTaskDTO, Task } from '../../shared/types/Task.types.js';
import { ValidationError } from '../../shared/errors/AppError.js';

export class CreateTaskService {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(userId: string, input: CreateTaskDTO): Promise<Task> {
    // Validação
    this.validateInput(input);

    // Lógica de negócio
    if (input.dueDate && input.dueDate < new Date()) {
      throw new ValidationError('Due date must be in the future');
    }

    // Criar tarefa
    const task = await this.taskRepository.create(userId, input);

    // TODO: Emitir evento (TaskCreated)
    // TODO: Chamar NotificationService

    return task;
  }

  private validateInput(input: CreateTaskDTO): void {
    if (!input.title || input.title.trim().length === 0) {
      throw new ValidationError('Title is required');
    }

    if (input.title.length > 255) {
      throw new ValidationError('Title must be less than 255 characters');
    }

    if (input.priority && !['low', 'medium', 'high'].includes(input.priority)) {
      throw new ValidationError('Invalid priority');
    }
  }
}
