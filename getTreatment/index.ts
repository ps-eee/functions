import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ExperimentInput } from '../interfaces/experiment-input';
import { Treatment } from '../interfaces/treatment';
import { TreatmentParam } from '../interfaces/treatment-param';
import { Experiment } from './experiment';
import sampleData from './sample-data';

const httpTrigger: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {

  context.log('getTreatment() processed a request.');

  const defaultTreatment: Treatment = {
    buyCtaColor: 'primary',
    buyCtaText: 'BUY NOW',
    isReviewsPrioritized: false,
    productHeroImage: 'left',
    productThumbnailImage: 'left'
  };

  const userId: number = request.query.userId ? Number(request.query.userId) : 0;

  if (userId === 0) {

    context.res = {
      status: 200,
      body: defaultTreatment
    };

    return;

  } else {

    const experimentInput: ExperimentInput = { userId };

    const treatmentParams: TreatmentParam[] = sampleData;

    const experiment: Experiment = new Experiment(experimentInput, treatmentParams);

    const experimentTreatment: Treatment = {
      buyCtaColor: experiment.get('buyCtaColor', defaultTreatment.buyCtaColor),
      buyCtaText: experiment.get('buyCtaText', defaultTreatment.buyCtaText),
      isReviewsPrioritized: experiment.get('isReviewsPrioritized', defaultTreatment.isReviewsPrioritized),
      productHeroImage: experiment.get('productHeroImage', defaultTreatment.productHeroImage),
      productThumbnailImage: experiment.get('productThumbnailImage', defaultTreatment.productThumbnailImage),
    };

    context.res = {
      status: 200,
      body: experimentTreatment
    };

    return;

  }

};

export default httpTrigger;
