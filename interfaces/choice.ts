import { Treatment } from './treatment';

export interface Choice {
  item: Treatment[keyof Treatment];
  weight: number;
}
