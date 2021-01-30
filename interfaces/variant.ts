import { Treatment } from './treatment';

export interface Variant {
  item: Treatment[keyof Treatment];
  weight: number;
}
