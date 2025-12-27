import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  create(
    @Body('projectId') projectId: string,
    @Body('name') name: string,
    @Req() req: any,
  ) {
    return this.workspacesService.createWorkspace(
      projectId,
      name,
      req.user.userId,
    );
  }
}
