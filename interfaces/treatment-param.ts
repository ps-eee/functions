import { Choice } from './choice';
import { Treatment } from './treatment';

export interface TreatmentParam {
  item: keyof Treatment;
  choices: Choice[];
}
