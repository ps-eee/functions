import { BuyCtaColor } from '../types/buy-cta-color';
import { BuyCtaText } from '../types/buy-cta-text';
import { FomoText } from '../types/fomo-text';
import { Image } from '../types/image';

export interface Treatment {
  buyCtaColor: BuyCtaColor;
  buyCtaText: BuyCtaText;
  fomoText: FomoText;
  productHeroImage: Image;
  productThumbnailImage: Image;
}
