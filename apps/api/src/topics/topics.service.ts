import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTopicDto: CreateTopicDto) {
    try {
      const topic = await this.prisma.topic.create({
        data: {
          name: createTopicDto.name,
          description: createTopicDto.description,
        },
      });
      return topic;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Topic with this name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.topic.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            subscriptions: true,
            content: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: {
        subscriptions: {
          include: {
            subscriber: true,
          },
        },
        content: {
          orderBy: {
            scheduledAt: 'desc',
          },
        },
        _count: {
          select: {
            subscriptions: true,
            content: true,
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }

    return topic;
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    // Check if topic exists
    await this.findOne(id);

    try {
      const topic = await this.prisma.topic.update({
        where: { id },
        data: updateTopicDto,
      });
      return topic;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Topic with this name already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Check if topic exists
    await this.findOne(id);

    await this.prisma.topic.delete({
      where: { id },
    });

    return { message: `Topic with ID ${id} has been deleted` };
  }

  async getSubscribers(id: number) {
    // Check if topic exists
    await this.findOne(id);

    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: {
        subscriptions: {
          include: {
            subscriber: true,
          },
        },
      },
    });

    return topic?.subscriptions.map((sub) => sub.subscriber) || [];
  }
}
