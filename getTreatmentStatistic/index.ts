import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as ObjectHash from 'object-hash';
import * as UCB from 'ucb';
import { ExperimentInput } from '../interfaces/experiment-input';
import { Treatment } from '../interfaces/treatment';
import { TreatmentStatistic } from '../interfaces/treatment-statistic';
import { Experiment } from './experiment';
import { TREATMENT_PARAMS } from './treatment-params';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  if (req.method === 'GET') {

    if (req.query.userId && Number.isInteger(Number(req.query.userId))) {

      try {

        const experimentInput: ExperimentInput = { userId: Number(req.query.userId) };

        const experiment: Experiment = new Experiment(experimentInput, TREATMENT_PARAMS);

        const defaultTreatment: Treatment = {
          buyCtaColor: 'primary',
          buyCtaText: 'BUY NOW',
          isReviewsPrioritized: false,
          productHeroImage: 'left',
          productThumbnailImage: 'left'
        };

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
            exposureCount: 0,
            successCount: 0,
            treatment: generatedTreatment,
            treatmentHash: generatedTreatmentHash
          };

          // TODO: DB - save new treatmentStatistic

          context.res = { status: 200, body: generatedTreatmentStatistic };

        } else {

          const arms = treatmentStatistics.length;
          const counts = treatmentStatistics.map((treatmentStatistic: TreatmentStatistic): TreatmentStatistic['exposureCount'] => treatmentStatistic.exposureCount);
          const values = treatmentStatistics.map((treatmentStatistic: TreatmentStatistic): number => treatmentStatistic.successCount / treatmentStatistic.exposureCount);

          const ucb = new UCB({ arms, counts, values });

          const selectedTreatmentStatisticIndex = await ucb.select();

          const selectedTreatmentStatistic = treatmentStatistics[selectedTreatmentStatisticIndex];

          context.res = { status: 200, body: selectedTreatmentStatistic };

        }

      } catch (error) {

        context.log(error);

        context.res = { status: 500, body: null };

      }

    } else { context.res = { status: 400, body: null }; }

  } else { context.res = { status: 404, body: null }; }

};

export default httpTrigger;
