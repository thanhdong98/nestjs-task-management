import { Injectable } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/getTaskDto';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      descriptions: 'helloworld',
      status: TaskStatus.IN_PROGRESS,
      title: 'Dong',
    },
  ];

  getTasksWithFilters({ status, search }: GetTasksFilterDto): Task[] {
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (t) =>
          t.descriptions
            .toLowerCase()
            .trim()
            .includes(search.toLowerCase().trim()) ||
          t.title.toLowerCase().trim().includes(search.toLowerCase().trim()),
      );
    }

    return tasks;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((t) => t.id === id);
  }

  createTask(title: string, descriptions: string): Task {
    const newTask = {
      id: (this.tasks.length + 1).toString(),
      descriptions,
      title,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(task: Task): void {
    const updateIdex = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks.splice(updateIdex, 1, task);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
    }
    return task;
  }

  deleteTask(id: string): void {
    const deleteIdx = this.tasks.findIndex((t) => t.id === id);
    this.tasks.splice(deleteIdx, 1);
  }
}

