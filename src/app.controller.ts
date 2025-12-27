import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';

@Controller()
export class AppController {
  @Get('protected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  getProtected() {
    return { message: 'You are authenticated as OWNER' };
  }
}
