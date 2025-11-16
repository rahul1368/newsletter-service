import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
