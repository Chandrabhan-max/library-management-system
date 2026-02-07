import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    role: string,
  ) {
    const hashed = await bcrypt.hash(password, 10);

    const user = this.repo.create({
      name,
      email,
      password: hashed,
      role,
    });

    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.repo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async getAll() {
    return this.repo.find({
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async updateUser(id: number, body: any) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    await this.repo.update(id, body);
    return this.findById(id);
  }

  async delete(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.repo.delete(id);
    return { message: 'User deleted successfully' };
  }z
}
