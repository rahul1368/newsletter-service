import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContentDto: CreateContentDto) {
    // Validate topic exists
    const topic = await this.prisma.topic.findUnique({
      where: { id: createContentDto.topicId },
    });

    if (!topic) {
      throw new NotFoundException(
        `Topic with ID ${createContentDto.topicId} not found`,
      );
    }

    // Validate scheduledAt is in the future
    if (createContentDto.scheduledAt < new Date()) {
      throw new BadRequestException('Scheduled date must be in the future');
    }

    try {
      const content = await this.prisma.content.create({
        data: {
          topicId: createContentDto.topicId,
          title: createContentDto.title,
          body: createContentDto.body,
          scheduledAt: createContentDto.scheduledAt,
          status: 'pending',
        },
        include: {
          topic: true,
        },
      });
      return content;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Topic with ID ${createContentDto.topicId} not found`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.content.findMany({
      orderBy: {
        scheduledAt: 'desc',
      },
      include: {
        topic: true,
        _count: {
          select: {
            emailLogs: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            _count: {
              select: {
                subscriptions: true,
              },
            },
          },
        },
        emailLogs: {
          take: 10,
          orderBy: {
            sentAt: 'desc',
          },
          include: {
            subscriber: true,
          },
        },
        _count: {
          select: {
            emailLogs: true,
          },
        },
      },
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return content;
  }

  async update(id: number, updateContentDto: UpdateContentDto) {
    // Check if content exists
    const existingContent = await this.findOne(id);

    // Validate topic exists if topicId is being updated
    if (updateContentDto.topicId !== undefined) {
      const topic = await this.prisma.topic.findUnique({
        where: { id: updateContentDto.topicId },
      });

      if (!topic) {
        throw new NotFoundException(
          `Topic with ID ${updateContentDto.topicId} not found`,
        );
      }
    }

    // Validate scheduledAt is in the future if being updated
    if (
      updateContentDto.scheduledAt !== undefined &&
      updateContentDto.scheduledAt < new Date()
    ) {
      throw new BadRequestException('Scheduled date must be in the future');
    }

    // Don't allow updating content that's already been sent
    if (existingContent.status === 'sent') {
      throw new BadRequestException(
        'Cannot update content that has already been sent',
      );
    }

    try {
      const content = await this.prisma.content.update({
        where: { id },
        data: updateContentDto,
        include: {
          topic: true,
        },
      });
      return content;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Topic with ID ${updateContentDto.topicId} not found`,
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Check if content exists
    const content = await this.findOne(id);

    // Don't allow deleting content that's already been sent
    if (content.status === 'sent') {
      throw new BadRequestException(
        'Cannot delete content that has already been sent',
      );
    }

    await this.prisma.content.delete({
      where: { id },
    });

    return { message: `Content with ID ${id} has been deleted` };
  }

  async findByTopic(topicId: number) {
    // Validate topic exists
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    return this.prisma.content.findMany({
      where: { topicId },
      orderBy: {
        scheduledAt: 'desc',
      },
      include: {
        topic: true,
        _count: {
          select: {
            emailLogs: true,
          },
        },
      },
    });
  }
}
