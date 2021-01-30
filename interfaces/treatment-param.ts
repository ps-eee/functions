import { Treatment } from './treatment';
import { Variant } from './variant';

export interface TreatmentParam {
  item: keyof Treatment;
  variants: Variant[];
}
