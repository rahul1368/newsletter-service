import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import {
  type CreateSubscriberDto,
  createSubscriberSchema,
} from './dto/create-subscriber.dto';
import {
  type UpdateSubscriberDto,
  updateSubscriberSchema,
} from './dto/update-subscriber.dto';
import { createZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(createZodValidationPipe(createSubscriberSchema))
    createSubscriberDto: CreateSubscriberDto,
  ) {
    return this.subscribersService.create(createSubscriberDto);
  }

  @Get()
  findAll() {
    return this.subscribersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subscribersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(createZodValidationPipe(updateSubscriberSchema))
    updateSubscriberDto: UpdateSubscriberDto,
  ) {
    return this.subscribersService.update(id, updateSubscriberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subscribersService.remove(id);
  }
}
