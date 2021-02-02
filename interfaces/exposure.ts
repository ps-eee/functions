import { TreatmentStatistic } from './treatment-statistic';
import { User } from './user';

export interface Exposure {
  id: string;
  isSuccessful: boolean;
  timestamp: string;
  treatmentHash: TreatmentStatistic['treatmentHash'];
  userId: User['userId'];
}
