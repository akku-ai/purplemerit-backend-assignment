import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(name: string, ownerId: string) {
    return this.prisma.project.create({
      data: {
        name,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'OWNER',
          },
        },
      },
    });
  }

  async getProjects(userId: string) {
    return this.prisma.project.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
    });
  }

  async addMember(
    projectId: string,
    email: string,
    role: 'COLLABORATOR' | 'VIEWER',
    requesterId: string,
  ) {
    const owner = await this.prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: requesterId,
        role: 'OWNER',
      },
    });

    if (!owner) {
      throw new ForbiddenException('Only owner can invite members');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
        role,
      },
    });
  }
}
