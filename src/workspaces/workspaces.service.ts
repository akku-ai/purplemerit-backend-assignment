import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async createWorkspace(projectId: string, name: string, userId: string) {
    const member = await this.prisma.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!member || member.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can create workspace');
    }

    return this.prisma.workspace.create({
      data: {
        name,
        projectId,
      },
    });
  }
}
