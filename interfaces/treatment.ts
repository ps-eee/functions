import { BuyCtaColors } from '../types/buy-cta-colors';
import { BuyCtaTexts } from '../types/buy-cta-texts';
import { Images } from '../types/images';

export interface Treatment {
  buyCtaColor: BuyCtaColors;
  buyCtaText: BuyCtaTexts;
  isReviewsPrioritized: boolean;
  productHeroImage: Images;
  productThumbnailImage: Images;
}
