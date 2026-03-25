// @ts-nocheck
// Example: TaskRepository Implementation

// @ts-ignore
import { PrismaClient } from '@prisma/client';
import type { ITaskRepository } from '../../domain/interfaces/ITaskRepository.js';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../../shared/types/Task.types.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

const prismaClient = new (PrismaClient as any)();

export class TaskRepository implements ITaskRepository {
  constructor(private prisma = prismaClient) {}

  async create(userId: string, data: CreateTaskDTO): Promise<Task> {
    return await this.prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        dueDate: data.dueDate
      }
    });
  }

  async findById(id: string): Promise<Task | null> {
    return await this.prisma.task.findUnique({
      where: { id }
    });
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Task | null> {
    return await this.prisma.task.findFirst({
      where: { id, userId }
    });
  }

  async update(id: string, data: UpdateTaskDTO): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return await this.prisma.task.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    await this.prisma.task.delete({ where: { id } });
  }
}
