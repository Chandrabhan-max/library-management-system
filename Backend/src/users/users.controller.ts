import { Controller, Get, Delete, Param, UseGuards, Patch, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getUsers() {
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req, @Body() body) {
    return this.usersService.updateUser(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body) {
    return this.usersService.updateUser(Number(id), body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(Number(id));
  }
  @UseGuards(JwtAuthGuard)
@Get('me')
getProfile(@Req() req) {
  return {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };
}
}
