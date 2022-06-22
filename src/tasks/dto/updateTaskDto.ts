import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../tasks.model';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  descriptions: string;
}
