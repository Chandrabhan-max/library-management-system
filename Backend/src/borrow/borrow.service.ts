import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow, BorrowStatus } from './borrow.entity';
import { UsersService } from '../users/users.service';
import { ResourcesService } from '../resources/resources.service';
import { Resource } from '../resources/resource.entity';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private readonly repo: Repository<Borrow>,
    private readonly usersService: UsersService,
    private readonly resourcesService: ResourcesService,
  ) {}

  async borrow(
    userId: number,
    resourceId: number,
    days: number,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resource = await this.resourcesService.findOne(resourceId);
    if (!resource) {
      throw new NotFoundException('Book not found');
    }

    if (!resource.available) {
      throw new BadRequestException('Book not available');
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const record: Borrow = this.repo.create({
      user,
      resource: resource as Resource,
      issueDate,
      dueDate,
      status: BorrowStatus.ISSUED,
      fine: 0,
    });

    await this.repo.save(record);
    await this.resourcesService.markAsIssued(resource.id);

    return record;
  }

  async returnBook(borrowId: number) {
    const record = await this.repo.findOne({
      where: { id: borrowId },
      relations: ['resource'],
    });

    if (!record) {
      throw new NotFoundException('Borrow record not found');
    }

    record.status = BorrowStatus.RETURNED;
    await this.repo.save(record);

    await this.resourcesService.markAsAvailable(record.resource.id);

    return { returned: true };
  }

  async renew(borrowId: number) {
    const record = await this.repo.findOne({
      where: { id: borrowId },
    });

    if (!record) {
      throw new NotFoundException('Borrow record not found');
    }

    record.dueDate.setDate(record.dueDate.getDate() + 30);
    await this.repo.save(record);

    return record;
  }

  getUserBorrowedBooks(userId: number) {
    return this.repo.find({
      where: {
        user: { id: userId },
        status: BorrowStatus.ISSUED,
      },
      relations: ['resource'],
    });
  }
}
