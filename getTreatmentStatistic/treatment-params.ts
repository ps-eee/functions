import { TreatmentParam } from '../interfaces/treatment-param';

export const TREATMENT_PARAMS: TreatmentParam[] = [
  {
    item: 'buyCtaColor',
    choices: [
      {
        item: 'primary',
        weight: 1
      },
      {
        item: 'accent',
        weight: 1
      },
      {
        item: 'warn',
        weight: 1
      }
    ]
  },
  {
    item: 'fomoText',
    choices: [
      {
        item: 'Only 3 left, more on the way.',
        weight: 1
      },
      {
        item: 'Almost Gone!',
        weight: 1
      }
    ]
  },
  {
    item: 'productThumbnailImage',
    choices: [
      {
        item: 'left',
        weight: 1
      },
      {
        item: 'bottom',
        weight: 1
      },
      {
        item: 'right',
        weight: 1
      }
    ]
  }
];
