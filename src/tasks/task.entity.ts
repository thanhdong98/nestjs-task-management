import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './tasks.model';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  descriptions: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_) => User, (user) => user.tasks, { eager: false })
  user: User;
}
