// @ts-nocheck
// Example: TaskController

import type { Request, Response } from 'express';
import type { CreateTaskService } from '../../../application/services/CreateTaskService.example.js';
import type { ITaskRepository } from '../../../domain/interfaces/ITaskRepository.js';
import { TaskResponseDTO } from '../../../shared/types/Task.types.js';
import { AppError, ValidationError } from '../../../shared/errors/AppError.js';
import type { Task } from '../../../shared/types/Task.types.js';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export class TaskController {
  constructor(
    private createTaskService: CreateTaskService,
    private taskRepository: ITaskRepository
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const task = await this.createTaskService.execute(userId, req.body);

      res.status(201).json(new TaskResponseDTO(task));
    } catch (err) {
      this.handleError(err, res);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const tasks = await this.taskRepository.findByUserId(userId);

      res.json(tasks.map((task: Task) => new TaskResponseDTO(task)));
    } catch (err) {
      this.handleError(err, res);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const task = await this.taskRepository.findByIdAndUserId(id, userId || '');
      
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.json(new TaskResponseDTO(task));
    } catch (err) {
      this.handleError(err, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const task = await this.taskRepository.findByIdAndUserId(id, userId);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      const updatedTask = await this.taskRepository.update(id, req.body);
      res.json(new TaskResponseDTO(updatedTask));
    } catch (err) {
      this.handleError(err, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const task = await this.taskRepository.findByIdAndUserId(id, userId);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      await this.taskRepository.delete(id);
      res.status(204).send();
    } catch (err) {
      this.handleError(err, res);
    }
  }

  private handleError(err: unknown, res: Response): void {
    if (err instanceof AppError) {
      const appError = err as AppError;
      res.status(appError.statusCode).json({
        error: appError.message,
        statusCode: appError.statusCode
      });
    } else if (err instanceof Error) {
      res.status(500).json({
        error: err.message
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error'
      });
    }
  }
}
