import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/createTaskDto';
import { GetTasksFilterDto } from './dto/getTaskDto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/updateTaskDto';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private taskService: TasksService) {}

  @Get()
  async getAllTask(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto
      )} `
    );
    return await this.taskService.getTasksWithFilters(filterDto, user);
  }

  @Get('/:id')
  async getTask(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return await this.taskService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() { title, descriptions }: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return await this.taskService.createTask(title, descriptions, user);
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
    @Body() updateTaskDto: UpdateTaskStatusDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, updateTaskDto.status, user);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<void> {
    await this.taskService.deleteTask(id, user);
  }
}
