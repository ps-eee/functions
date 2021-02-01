import { TreatmentStatistic } from './treatment-statistic';
import { User } from './user';

export interface Exposure {
  timestamp: string;
  treatmentHash: TreatmentStatistic['treatmentHash'];
  userId: User['userId'];
}
