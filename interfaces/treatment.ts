import { BuyCtaColors } from '../types/buy-cta-colors';
import { BuyCtaTexts } from '../types/buy-cta-texts';
import { FomoTexts } from '../types/fomo-texts';
import { Images } from '../types/images';

export interface Treatment {
  buyCtaColor: BuyCtaColors;
  buyCtaText: BuyCtaTexts;
  fomoText: FomoTexts;
  productHeroImage: Images;
  productThumbnailImage: Images;
}
