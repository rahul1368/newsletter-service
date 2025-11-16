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

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSubscriberDto: CreateSubscriberDto) {
    // Validate with Zod schema
    const validated = createSubscriberSchema.parse(createSubscriberDto);
    return this.subscribersService.create(validated);
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
    @Body() updateSubscriberDto: UpdateSubscriberDto,
  ) {
    // Validate with Zod schema
    const validated = updateSubscriberSchema.parse(updateSubscriberDto);
    return this.subscribersService.update(id, validated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subscribersService.remove(id);
  }
}
