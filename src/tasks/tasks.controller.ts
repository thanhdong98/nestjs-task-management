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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/createTaskDto';
import { GetTasksFilterDto } from './dto/getTaskDto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/updateTaskDto';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getAllTask(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskService.getTasksWithFilters(filterDto);
  }

  @Get('/:id')
  async getTask(@Param('id') id: string): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @Post()
  async createTask(
    @Body() { title, descriptions }: CreateTaskDto
  ): Promise<Task> {
    return await this.taskService.createTask(title, descriptions);
  }

  @Put('/:id')
  async updateTask(
    @Body() { title, descriptions }: UpdateTaskDto,
    @Param() id: string
  ): Promise<Task> {
    return this.taskService.updateTask(id, title, descriptions);
  }

  @Patch('/:id/status')
  async updateStatusTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskStatusDto
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, updateTaskDto.status);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.taskService.deleteTask(id);
  }
}
