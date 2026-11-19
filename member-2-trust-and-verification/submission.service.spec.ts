import { describe, expect, it } from 'vitest';
import { SubmissionService } from './submission.service.js';

describe('SubmissionService', () => {
  it('rejects duplicate submissions within 24 hours', () => {
    const service = new SubmissionService();
    const duplicate = service.detectDuplicate(1, 'Local Tech Hub', 31999, '2026-11-05');

    expect(duplicate).toBe(true);
  });
});
