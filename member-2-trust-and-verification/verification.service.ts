import { Injectable } from '@nestjs/common';

export interface VoteEntry {
  userId: string;
  trustWeight: number;
  decision: 'confirm' | 'dispute';
}

@Injectable()
export class VerificationService {
  summarize(votes: VoteEntry[]) {
    const confirmScore = votes.filter((vote) => vote.decision === 'confirm').reduce((sum, vote) => sum + vote.trustWeight, 0);
    const disputeCount = votes.filter((vote) => vote.decision === 'dispute').length;
    const status = confirmScore >= 3.0 && disputeCount === 0 ? 'Verified' : disputeCount >= 2 ? 'Disputed' : 'Pending';

    return {
      confirmScore,
      disputeCount,
      status,
      thresholdReached: confirmScore >= 3.0,
    };
  }
}
