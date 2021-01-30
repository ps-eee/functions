import { TreatmentParam } from '../interfaces/treatment-param';

const treatmentParams: TreatmentParam[] = [
  {
    "item": "buyCtaColor",
    "variants": [
      {
        "item": "primary",
        "weight": 1
      },
      {
        "item": "accent",
        "weight": 1
      },
      {
        "item": "warn",
        "weight": 1
      }
    ]
  },
  {
    "item": "buyCtaText",
    "variants": [
      {
        "item": "BUY NOW",
        "weight": 1
      },
      {
        "item": "GET IT NOW",
        "weight": 1
      },
      {
        "item": "ADD TO CART",
        "weight": 1
      }
    ]
  },
  {
    "item": "isReviewsPrioritized",
    "variants": [
      {
        "item": true,
        "weight": 1
      },
      {
        "item": false,
        "weight": 1
      }
    ]
  },
  {
    "item": "productHeroImage",
    "variants": [
      {
        "item": "left",
        "weight": 1
      },
      {
        "item": "bottom",
        "weight": 1
      },
      {
        "item": "right",
        "weight": 1
      }
    ]
  },
  {
    "item": "productThumbnailImage",
    "variants": [
      {
        "item": "left",
        "weight": 1
      },
      {
        "item": "bottom",
        "weight": 1
      },
      {
        "item": "right",
        "weight": 1
      }
    ]
  }
];

export default treatmentParams;
