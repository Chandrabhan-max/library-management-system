import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './resource.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly repo: Repository<Resource>,
  ) {}

  async create(data: {
    name: string;
    author: string;
    genre: string;
    publishedYear: number;
  }) {
    const resource = this.repo.create({
      ...data,
      available: true,
    });

    return this.repo.save(resource);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Resource>) {
    const resource = await this.findOne(id);
    if (!resource) throw new NotFoundException('Book not found');

    Object.assign(resource, data);
    return this.repo.save(resource);
  }

  async delete(id: number) {
    const resource = await this.findOne(id);
    if (!resource) throw new NotFoundException('Book not found');

    await this.repo.remove(resource);
    return { deleted: true };
  }

  async markAsIssued(id: number) {
    const resource = await this.findOne(id);
    if (!resource) throw new NotFoundException('Book not found');

    resource.available = false;
    return this.repo.save(resource);
  }

  async markAsAvailable(id: number) {
    const resource = await this.findOne(id);
    if (!resource) throw new NotFoundException('Book not found');

    resource.available = true;
    return this.repo.save(resource);
  }
}
 