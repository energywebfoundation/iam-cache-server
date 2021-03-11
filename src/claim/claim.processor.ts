import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ClaimService } from './claim.service';

@Processor('claims')
export class ClaimProcessor {
  constructor(private readonly claimService: ClaimService) {}

  @Process('save')
  public async processClaim(job: Job<string>) {
    const json = JSON.parse(job.data);
    await this.claimService.handleExchangeMessage(json);
  }
}
