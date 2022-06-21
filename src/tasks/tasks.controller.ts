import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/createTaskDto';
import { GetTasksFilterDto } from './dto/getTaskDto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTask(@Query() filterDto: GetTasksFilterDto): Task[] {
    return Object.keys(filterDto).length
      ? this.taskService.getTasksWithFilters(filterDto)
      : this.taskService.getAllTasks();
  }

  @Get('/:id')
  getTask(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() { title, descriptions }: CreateTaskDto): Task {
    return this.taskService.createTask(title, descriptions);
  }

  @Put()
  updateTask(@Body() task: Task) {
    this.taskService.updateTask(task);
  }

  @Patch('/:id/status')
  updateStatusTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    this.taskService.deleteTask(id);
  }
}

