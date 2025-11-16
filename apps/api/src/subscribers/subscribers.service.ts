import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SubscribersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubscriberDto: CreateSubscriberDto) {
    try {
      const subscriber = await this.prisma.subscriber.create({
        data: {
          email: createSubscriberDto.email,
        },
      });
      return subscriber;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Subscriber with this email already exists',
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.subscriber.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { id },
      include: {
        subscriptions: {
          include: {
            topic: true,
          },
        },
      },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }

    return subscriber;
  }

  async update(id: number, updateSubscriberDto: UpdateSubscriberDto) {
    // Check if subscriber exists
    await this.findOne(id);

    try {
      const subscriber = await this.prisma.subscriber.update({
        where: { id },
        data: updateSubscriberDto,
      });
      return subscriber;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Subscriber with this email already exists',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Check if subscriber exists
    await this.findOne(id);

    await this.prisma.subscriber.delete({
      where: { id },
    });

    return { message: `Subscriber with ID ${id} has been deleted` };
  }
}
