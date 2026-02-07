import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from './borrow.entity';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { UsersModule } from '../users/users.module';
import { ResourcesModule } from '../resources/resources.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrow]),
    UsersModule,
    ResourcesModule,
  ],
  providers: [BorrowService],
  controllers: [BorrowController],
})
export class BorrowModule {}
