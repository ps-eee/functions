import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as ObjectHash from 'object-hash';
import * as UCB from 'ucb';
import { ExperimentInput } from '../interfaces/experiment-input';
import { Treatment } from '../interfaces/treatment';
import { TreatmentStatistic } from '../interfaces/treatment-statistic';
import { Experiment } from './experiment';
import { TREATMENT_PARAMS } from './treatment-params';

const httpTrigger: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {

  const defaultTreatment: Treatment = {
    buyCtaColor: 'primary',
    buyCtaText: 'BUY NOW',
    isReviewsPrioritized: false,
    productHeroImage: 'left',
    productThumbnailImage: 'left'
  };

  const defaultTreatmentHash: string = ObjectHash(defaultTreatment);

  const defaultTreatmentStatistic: TreatmentStatistic = {
    runCount: 0,
    successCount: 0,
    treatment: defaultTreatment,
    treatmentHash: defaultTreatmentHash
  };

  try {

    const userId: number = request.query.userId ? Number(request.query.userId) : 0;

    if (userId === 0) {

      context.res = {
        status: 200,
        body: defaultTreatmentStatistic
      };

    } else {

      const experimentInput: ExperimentInput = { userId };

      const experiment: Experiment = new Experiment(experimentInput, TREATMENT_PARAMS);

      const generatedTreatment: Treatment = {
        buyCtaColor: experiment.get('buyCtaColor', defaultTreatment.buyCtaColor),
        buyCtaText: experiment.get('buyCtaText', defaultTreatment.buyCtaText),
        isReviewsPrioritized: experiment.get('isReviewsPrioritized', defaultTreatment.isReviewsPrioritized),
        productHeroImage: experiment.get('productHeroImage', defaultTreatment.productHeroImage),
        productThumbnailImage: experiment.get('productThumbnailImage', defaultTreatment.productThumbnailImage),
      };

      const generatedTreatmentHash: string = ObjectHash(generatedTreatment);

      // TODO: DB - get all treatmentStatistics

      const treatmentStatistics: TreatmentStatistic[] = [];

      const isTreatmentHashPresent: boolean = treatmentStatistics.filter((treatmentStatistic: TreatmentStatistic): boolean => treatmentStatistic.treatmentHash === generatedTreatmentHash).length === 1;

      if (!isTreatmentHashPresent) {

        const generatedTreatmentStatistic: TreatmentStatistic = {
          runCount: 1,
          successCount: 0,
          treatment: generatedTreatment,
          treatmentHash: generatedTreatmentHash
        };

        // TODO: DB - save new treatmentStatistic

        context.res = {
          status: 200,
          body: generatedTreatmentStatistic
        };

      } else {

        const arms = treatmentStatistics.length;
        const counts = treatmentStatistics.map((treatmentStatistic: TreatmentStatistic): TreatmentStatistic['runCount'] => treatmentStatistic.runCount);
        const values = treatmentStatistics.map((treatmentStatistic: TreatmentStatistic): number => treatmentStatistic.successCount / treatmentStatistic.runCount);

        const ucb = new UCB({ arms, counts, values });

        const selectedTreatmentStatisticIndex = await ucb.select();

        const selectedTreatmentStatistic = treatmentStatistics[selectedTreatmentStatisticIndex];

        // TODO: DB - update runCount

        context.res = {
          status: 200,
          body: selectedTreatmentStatistic
        };

      }

    }

  } catch (error) {

    context.log(error);

    context.res = {
      status: 200,
      body: defaultTreatmentStatistic
    };

  }

};

export default httpTrigger;
