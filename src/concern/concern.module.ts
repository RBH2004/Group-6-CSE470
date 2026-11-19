import { Module } from '@nestjs/common';
import { ConcernController } from './concern.controller.js';

@Module({
  controllers: [ConcernController],
})
export class ConcernModule {}
