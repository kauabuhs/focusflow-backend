// Repository Interface - Define o contrato

import type { Task, CreateTaskDTO, UpdateTaskDTO } from '@/shared/types/Task.types';

export interface ITaskRepository {
  create(userId: string, data: CreateTaskDTO): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string): Promise<Task[]>;
  update(id: string, data: UpdateTaskDTO): Promise<Task>;
  delete(id: string): Promise<void>;
  findByIdAndUserId(id: string, userId: string): Promise<Task | null>;
}
