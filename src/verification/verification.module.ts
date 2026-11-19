import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller.js';
import { VerificationService } from '../common/verification.service.js';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
