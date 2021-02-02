import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { COLLECTIONS } from '../constants/collections';
import { faunadbClient, faunadbQuery } from '../constants/faunadb';
import { INDEXES } from '../constants/indexes';
import { Exposure } from '../interfaces/exposure';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  if (req.method === 'POST') {

    if (req.body && req.body.timestamp && req.body.treatmentHash && req.body.userId) {

      try {

        const partialExposure: Omit<Exposure, 'id'> = {
          isSuccessful: false,
          ...req.body
        };

        const saveExposure = faunadbQuery.Create(
          faunadbQuery.Collection(COLLECTIONS.EXPOSURES),
          { data: partialExposure }
        );

        // TODO: Fix query

        const updateExposureCount = faunadbQuery.Map(
          faunadbQuery.Paginate(
            faunadbQuery.Match(
              faunadbQuery.Index(INDEXES.TREATMENT_STATISTICS_BY_TREATMENT_HASH), partialExposure.treatmentHash)
          ),
          faunadbQuery.Lambda("X", faunadbQuery.Update(faunadbQuery.Var("X"), {
            data: {
              exposureCount: faunadbQuery.Add(faunadbQuery.Get("X"), 1)
            }
          }))
        );

        const transaction = faunadbClient.query(
          faunadbQuery.Do(
            saveExposure,
            // updateExposureCount
          )
        )

        const response = await transaction;

        const exposure: Exposure = {
          ...response['data'],
          id: response['ref'].id
        }

        context.res = { status: 201, body: exposure };

      } catch (error) {

        context.log(error);

        context.res = { status: 500, body: null };

      }

    } else { context.res = { status: 400, body: null }; }

  } else { context.res = { status: 404, body: null }; }

};

export default httpTrigger;
