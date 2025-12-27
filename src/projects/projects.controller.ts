import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  create(@Body('name') name: string, @Req() req: any) {
    return this.projectsService.createProject(name, req.user.userId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.projectsService.getProjects(req.user.userId);
  }

  @Post(':id/invite')
  invite(
    @Param('id') projectId: string,
    @Body('email') email: string,
    @Body('role') role: 'COLLABORATOR' | 'VIEWER',
    @Req() req: any,
  ) {
    return this.projectsService.addMember(
      projectId,
      email,
      role,
      req.user.userId,
    );
  }
}
