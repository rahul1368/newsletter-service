import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';

interface EmailJobData {
  contentId: number;
  topicId: number;
}

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<void> {
    const { contentId, topicId } = job.data;

    this.logger.log(
      `Processing email job for content ID ${contentId}, topic ID ${topicId}`,
    );

    try {
      // Get content
      const content = await this.prisma.content.findUnique({
        where: { id: contentId },
        include: {
          topic: true,
        },
      });

      if (!content) {
        throw new Error(`Content with ID ${contentId} not found`);
      }

      // Check if content has already been sent
      if (content.status === 'sent') {
        this.logger.warn(
          `Content ${contentId} has already been sent, skipping`,
        );
        return;
      }

      // Get all subscribers for this topic
      const subscriptions = await this.prisma.subscription.findMany({
        where: {
          topicId,
          subscriber: {
            isActive: true,
          },
        },
        include: {
          subscriber: true,
        },
      });

      if (subscriptions.length === 0) {
        this.logger.warn(`No active subscribers found for topic ${topicId}`);
        // Update content status to sent even if no subscribers
        await this.prisma.content.update({
          where: { id: contentId },
          data: {
            status: 'sent',
            sentAt: new Date(),
          },
        });
        return;
      }

      this.logger.log(
        `Sending emails to ${subscriptions.length} subscribers for content ${contentId}`,
      );

      // Send emails to all subscribers
      const emailResults = await Promise.allSettled(
        subscriptions.map(async (subscription) => {
          try {
            // Generate unsubscribe link (placeholder - would need proper URL in production)
            const unsubscribeLink = `${process.env.APP_URL || 'http://localhost:3000'}/unsubscribe?subscriber=${subscription.subscriberId}&topic=${topicId}`;

            const result = await this.emailService.sendContentToSubscriber(
              subscription.subscriber.email,
              content.title,
              content.body,
              content.topic.name,
              unsubscribeLink,
            );

            // Log successful email
            await this.prisma.emailLog.create({
              data: {
                contentId,
                subscriberId: subscription.subscriberId,
                status: 'sent',
              },
            });

            return {
              subscriberId: subscription.subscriberId,
              email: subscription.subscriber.email,
              status: 'sent',
              messageId: result.id,
            };
          } catch (error) {
            this.logger.error(
              `Failed to send email to subscriber ${subscription.subscriberId}:`,
              error,
            );

            // Log failed email
            await this.prisma.emailLog.create({
              data: {
                contentId,
                subscriberId: subscription.subscriberId,
                status: 'failed',
                errorMessage:
                  error instanceof Error ? error.message : 'Unknown error',
              },
            });

            return {
              subscriberId: subscription.subscriberId,
              email: subscription.subscriber.email,
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
        }),
      );

      // Count successful and failed emails
      const successful = emailResults.filter(
        (result) =>
          result.status === 'fulfilled' && result.value.status === 'sent',
      ).length;
      const failed = emailResults.length - successful;

      this.logger.log(
        `Email job completed for content ${contentId}: ${successful} sent, ${failed} failed`,
      );

      // Update content status to sent
      await this.prisma.content.update({
        where: { id: contentId },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to process email job for content ${contentId}:`,
        error,
      );

      // Update content status to failed
      await this.prisma.content
        .update({
          where: { id: contentId },
          data: {
            status: 'failed',
          },
        })
        .catch((updateError) => {
          this.logger.error(`Failed to update content status:`, updateError);
        });

      throw error;
    }
  }
}
