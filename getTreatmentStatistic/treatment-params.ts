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
    item: 'buyCtaText',
    choices: [
      {
        item: 'BUY NOW',
        weight: 1
      },
      {
        item: 'GET IT NOW',
        weight: 1
      },
      {
        item: 'ADD TO CART',
        weight: 1
      }
    ]
  },
  {
    item: 'isReviewsPrioritized',
    choices: [
      {
        item: true,
        weight: 1
      },
      {
        item: false,
        weight: 1
      }
    ]
  },
  {
    item: 'productHeroImage',
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
