import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ServiceStats {
  subscribers: {
    total: number;
    active: number;
    inactive: number;
  };
  topics: {
    total: number;
  };
  subscriptions: {
    total: number;
  };
  content: {
    total: number;
    pending: number;
    sent: number;
    failed: number;
  };
  emails: {
    total: number;
    sent: number;
    failed: number;
  };
}

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<ServiceStats> {
    // Get subscriber stats
    const [totalSubscribers, activeSubscribers] = await Promise.all([
      this.prisma.subscriber.count(),
      this.prisma.subscriber.count({
        where: { isActive: true },
      }),
    ]);

    // Get topic stats
    const totalTopics = await this.prisma.topic.count();

    // Get subscription stats
    const totalSubscriptions = await this.prisma.subscription.count();

    // Get content stats
    const [totalContent, pendingContent, sentContent, failedContent] =
      await Promise.all([
        this.prisma.content.count(),
        this.prisma.content.count({
          where: { status: 'pending' },
        }),
        this.prisma.content.count({
          where: { status: 'sent' },
        }),
        this.prisma.content.count({
          where: { status: 'failed' },
        }),
      ]);

    // Get email stats
    const [totalEmails, sentEmails, failedEmails] = await Promise.all([
      this.prisma.emailLog.count(),
      this.prisma.emailLog.count({
        where: { status: 'sent' },
      }),
      this.prisma.emailLog.count({
        where: { status: 'failed' },
      }),
    ]);

    return {
      subscribers: {
        total: totalSubscribers,
        active: activeSubscribers,
        inactive: totalSubscribers - activeSubscribers,
      },
      topics: {
        total: totalTopics,
      },
      subscriptions: {
        total: totalSubscriptions,
      },
      content: {
        total: totalContent,
        pending: pendingContent,
        sent: sentContent,
        failed: failedContent,
      },
      emails: {
        total: totalEmails,
        sent: sentEmails,
        failed: failedEmails,
      },
    };
  }
}
