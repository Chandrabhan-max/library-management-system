import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('borrow')
@UseGuards(JwtAuthGuard)
export class BorrowController {
  constructor(private readonly service: BorrowService) {}

  @Post(':resourceId')
  borrowBook(
    @Param('resourceId') resourceId: string,
    @Body('days') days: number,
    @Req() req: any,
  ) {
    return this.service.borrow(
      req.user.id,
      Number(resourceId),
      days || 7,
    );
  }

  @Post('return/:borrowId')
  returnBook(@Param('borrowId') borrowId: string) {
    return this.service.returnBook(Number(borrowId));
  }

  @Post('renew/:borrowId')
  renewBook(@Param('borrowId') borrowId: string) {
    return this.service.renew(Number(borrowId));
  }

  @Get('my')
  getMyBorrowedBooks(@Req() req: any) {
    return this.service.getUserBorrowedBooks(req.user.id);
  }
}
