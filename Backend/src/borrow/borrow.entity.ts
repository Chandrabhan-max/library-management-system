import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Resource } from '../resources/resource.entity';

export enum BorrowStatus {
  ISSUED = 'ISSUED',
  RETURNED = 'RETURNED',
}

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Resource, { nullable: false })
  resource: Resource;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  issueDate: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: BorrowStatus,
    default: BorrowStatus.ISSUED,
  })
  status: BorrowStatus;

  @Column({
    type: 'int',
    default: 0,
  })
  fine: number;
}
