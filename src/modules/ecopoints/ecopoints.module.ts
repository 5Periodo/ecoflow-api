import { Module } from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { EcopointsController } from './ecopoints.controller';

@Module({
  providers: [EcopointsService],
  controllers: [EcopointsController]
})
export class EcopointsModule {}
