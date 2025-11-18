import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

/**
 * Creates a Zod validation pipe for a specific schema
 * Usage: @Body(createZodValidationPipe(createSubscriberSchema))
 */
export function createZodValidationPipe(schema: ZodSchema) {
  @Injectable()
  class SchemaValidationPipe implements PipeTransform {
    transform(value: unknown): unknown {
      try {
        return schema.parse(value);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          throw new BadRequestException({
            message: 'Validation failed',
            errors: formattedErrors,
          });
        }

        throw new BadRequestException('Validation failed');
      }
    }
  }

  return SchemaValidationPipe;
}
