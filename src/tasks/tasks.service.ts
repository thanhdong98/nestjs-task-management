import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { GetTasksFilterDto } from './dto/getTaskDto';
import { Task as TaskEntity } from './task.entity';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id, user });

    if (!found)
      throw new NotFoundException(`Task with ID \"${id}\" not found!`);

    return found;
  }

  async createTask(
    title: string,
    descriptions: string,
    user: User
  ): Promise<Task> {
    const newTask = this.tasksRepository.create({
      descriptions,
      title,
      user,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(newTask);

    return newTask;
  }

  async getTasksWithFilters(
    { status, search }: GetTasksFilterDto,
    user: User
  ): Promise<Task[]> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.descriptions ILIKE :search)',
        { search: `%${search.trim()}%` }
      );
    }
    const tasks = await query.getMany();

    return tasks;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id, user });

    if (!task) {
      throw new NotFoundException(`Task with ID \"${id}\" not found!`);
    }

    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (!result.affected) {
      throw new NotFoundException(`Task with ID \"${id}\" not found!`);
    }
  }

  async updateTask(
    id: string,
    title: string,
    descriptions: string
  ): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID \"${id}\" not found!`);
    }
    task.title = title;
    task.descriptions = descriptions;

    await this.tasksRepository.save(task);
    return task;
  }
}
