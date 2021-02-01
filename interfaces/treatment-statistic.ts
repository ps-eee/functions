import { Treatment } from './treatment';

export interface TreatmentStatistic {
  exposureCount: number;
  successCount: number;
  treatment: Treatment;
  treatmentHash: string;
}
