import { Treatment } from './treatment';

export interface TreatmentStatistic {
  runCount: number;
  successCount: number;
  treatment: Treatment;
  treatmentHash: string;
}
