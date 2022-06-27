import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { MockType } from 'src/types/MockType';
import { Repository } from 'typeorm';
import { Task } from '../task.entity';
import { TaskStatus } from '../tasks.model';
import { TasksService } from '../tasks.service';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    create: jest.fn((entity) => entity),
    save: jest.fn((_) => {}),
  })
);

describe('TasksService', () => {
  let service: TasksService;
  let repositoryMock: MockType<Repository<Task>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<TasksService>(TasksService);
    repositoryMock = module.get(getRepositoryToken(Task));
  });

  it('createTask', async () => {
    const task: Task = {
      id: '1',
      title: 'Dong',
      descriptions: 'hello',
      status: TaskStatus.OPEN,
      user: {
        username: 'Tester',
      } as User,
    };

    repositoryMock.create.mockReturnValue(task);
    expect(
      await service.createTask('Dong', 'hello', {
        username: 'Tester',
      } as User)
    ).toEqual(task);

    expect(repositoryMock.create).toHaveBeenCalledWith({
      title: 'Dong',
      descriptions: 'hello',
      status: TaskStatus.OPEN,
      user: {
        username: 'Tester',
      } as User,
    });
    expect(repositoryMock.save).toBeCalled();
  });

  // TOO LAZY TO IMPLEMENT THE REST...s
});
