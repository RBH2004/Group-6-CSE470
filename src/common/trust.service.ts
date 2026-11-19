import { Injectable } from '@nestjs/common';
import { businessRules } from './rules.config.js';

@Injectable()
export class TrustService {
  // Trust starts at 1.0 for a new account; each verified submission adds +0.2, each rejected one subtracts -0.3.
  // Formula: newTrust = clamp(previousTrust + (accepted ? 0.2 : -0.3), 0.2, 3.0)
  updateTrust(currentTrust: number, accepted: boolean): number {
    const nextTrust = currentTrust + (accepted ? 0.2 : -0.3);
    return Math.min(Math.max(nextTrust, businessRules.minTrust), businessRules.maxTrust);
  }
}
