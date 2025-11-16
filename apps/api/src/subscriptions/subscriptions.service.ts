import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(subscribeDto: SubscribeDto) {
    // Validate subscriber exists
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { id: subscribeDto.subscriberId },
    });

    if (!subscriber) {
      throw new NotFoundException(
        `Subscriber with ID ${subscribeDto.subscriberId} not found`,
      );
    }

    // Validate topic exists
    const topic = await this.prisma.topic.findUnique({
      where: { id: subscribeDto.topicId },
    });

    if (!topic) {
      throw new NotFoundException(
        `Topic with ID ${subscribeDto.topicId} not found`,
      );
    }

    // Check if already subscribed
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: {
        subscriberId_topicId: {
          subscriberId: subscribeDto.subscriberId,
          topicId: subscribeDto.topicId,
        },
      },
    });

    if (existingSubscription) {
      throw new ConflictException(
        'Subscriber is already subscribed to this topic',
      );
    }

    // Create subscription
    try {
      const subscription = await this.prisma.subscription.create({
        data: {
          subscriberId: subscribeDto.subscriberId,
          topicId: subscribeDto.topicId,
        },
        include: {
          subscriber: true,
          topic: true,
        },
      });
      return subscription;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Subscriber is already subscribed to this topic',
        );
      }
      throw error;
    }
  }

  async unsubscribe(subscriberId: number, topicId: number) {
    // Validate subscriber exists
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { id: subscriberId },
    });

    if (!subscriber) {
      throw new NotFoundException(
        `Subscriber with ID ${subscriberId} not found`,
      );
    }

    // Validate topic exists
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    // Check if subscription exists
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        subscriberId_topicId: {
          subscriberId,
          topicId,
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscriber is not subscribed to this topic');
    }

    // Delete subscription
    await this.prisma.subscription.delete({
      where: {
        subscriberId_topicId: {
          subscriberId,
          topicId,
        },
      },
    });

    return { message: 'Successfully unsubscribed from topic' };
  }
}
