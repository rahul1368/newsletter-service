import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured');
    }
    this.resend = new Resend(apiKey);
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<{ id: string }> {
    try {
      const result = await this.resend.emails.send({
        from: 'Newsletter Service <onboarding@resend.dev>', // Update with your verified domain
        to: [to],
        subject,
        html,
        text,
      });

      if (result.error) {
        throw new Error(`Resend API error: ${result.error.message}`);
      }

      return { id: result.data?.id || 'unknown' };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendContentToSubscriber(
    subscriberEmail: string,
    contentTitle: string,
    contentBody: string,
    topicName: string,
    unsubscribeLink?: string,
  ): Promise<{ id: string }> {
    const html = this.generateEmailTemplate(
      contentTitle,
      contentBody,
      topicName,
      unsubscribeLink,
    );
    const text = this.generateTextEmailTemplate(
      contentTitle,
      contentBody,
      topicName,
      unsubscribeLink,
    );

    return this.sendEmail(
      subscriberEmail,
      `${topicName} - ${contentTitle}`,
      html,
      text,
    );
  }

  private generateEmailTemplate(
    title: string,
    body: string,
    topicName: string,
    unsubscribeLink?: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h1 style="color: #333; margin: 0;">${topicName}</h1>
          </div>
          <div style="background-color: #fff; padding: 20px; border-radius: 5px;">
            <h2 style="color: #333; margin-top: 0;">${title}</h2>
            <div style="white-space: pre-wrap;">${body}</div>
          </div>
          ${
            unsubscribeLink
              ? `
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666;">
            <a href="${unsubscribeLink}" style="color: #666; text-decoration: none;">Unsubscribe</a>
          </div>
          `
              : ''
          }
        </body>
      </html>
    `;
  }

  private generateTextEmailTemplate(
    title: string,
    body: string,
    topicName: string,
    unsubscribeLink?: string,
  ): string {
    return `
${topicName}
${'='.repeat(topicName.length)}

${title}

${body}

${unsubscribeLink ? `\nUnsubscribe: ${unsubscribeLink}` : ''}
    `.trim();
  }
}
