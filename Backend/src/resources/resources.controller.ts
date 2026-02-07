import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
