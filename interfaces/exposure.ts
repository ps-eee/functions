import { TreatmentStatistic } from './treatment-statistic';
import { User } from './user';

export interface Exposure {
  id: null | number;
  isSuccessful: boolean;
  timestamp: string;
  treatmentHash: TreatmentStatistic['treatmentHash'];
  userId: User['userId'];
}
