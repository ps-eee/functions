import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as ObjectHash from 'object-hash';
import * as UCB from 'ucb';
import { COLLECTIONS } from '../constants/collections';
import { faunadbClient, faunadbQuery } from '../constants/faunadb';
import { INDEXES } from '../constants/indexes';
import { ExperimentInput } from '../interfaces/experiment-input';
import { Treatment } from '../interfaces/treatment';
import { TreatmentStatistic } from '../interfaces/treatment-statistic';
import { Experiment } from './experiment';
import { TREATMENT_PARAMS } from './treatment-params';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  if (req.method === 'GET') {

    if (req.query.hasOwnProperty('userId') && Number.isInteger(Number(req.query.userId)) && Number(req.query.userId) >= 0) {

      try {

        const experimentInput: ExperimentInput = { userId: Number(req.query.userId) };

        const experiment: Experiment = new Experiment(experimentInput, TREATMENT_PARAMS);

        const defaultTreatment: Treatment = {
          buyCtaColor: 'primary',
          fomoText: 'Almost Gone!',
          productThumbnailImage: 'left'
        };

        const generatedTreatment: Treatment = {
          buyCtaColor: experiment.get('buyCtaColor', defaultTreatment.buyCtaColor),
          fomoText: experiment.get('fomoText', defaultTreatment.fomoText),
          productThumbnailImage: experiment.get('productThumbnailImage', defaultTreatment.productThumbnailImage),
        };

        const generatedTreatmentHash: string = ObjectHash(generatedTreatment);

        const getAllTreatmentStatistics = faunadbClient.query(
          faunadbQuery.Map(
            faunadbQuery.Paginate(
              faunadbQuery.Match(
                faunadbQuery.Index(INDEXES.ALL_TREATMENT_STATISTICS)
              ),
              { size: 27 }
            ),
            faunadbQuery.Lambda('X', faunadbQuery.Get(faunadbQuery.Var('X')))
          )
        );

        const treatmentStatistics: TreatmentStatistic[] = (await getAllTreatmentStatistics)['data'].map(i => i.data);

        const isTreatmentHashPresent: boolean = treatmentStatistics.filter((treatmentStatistic: TreatmentStatistic): boolean => treatmentStatistic.treatmentHash === generatedTreatmentHash).length === 1;

        if (!isTreatmentHashPresent) {

          const generatedTreatmentStatistic: TreatmentStatistic = {
            exposureCount: 0,
            successCount: 0,
            treatment: generatedTreatment,
            treatmentHash: generatedTreatmentHash
          };

          const saveGeneratedTreatmentStatistic = faunadbClient.query(
            faunadbQuery.Create(
              faunadbQuery.Collection(COLLECTIONS.TREATMENT_STATISTICS),
              { data: generatedTreatmentStatistic }
            )
          );

          context.res = { status: 200, body: (await saveGeneratedTreatmentStatistic)['data'] };

        } else {

          const arms = treatmentStatistics.length;
          const counts = treatmentStatistics.map((treatmentStatistic: TreatmentStatistic): TreatmentStatistic['exposureCount'] => treatmentStatistic.exposureCount);
          const values = treatmentStatistics.map((treatmentStatistic: TreatmentStatistic): number => treatmentStatistic.successCount / treatmentStatistic.exposureCount || 0);

          const algorithmState = { arms, counts, values };

          const ucb = new UCB(algorithmState);

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
