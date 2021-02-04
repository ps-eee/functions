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

        const updateExposureCount = faunadbQuery.Map(
          faunadbQuery.Paginate(
            faunadbQuery.Match(
              faunadbQuery.Index(INDEXES.ALL_TREATMENT_STATISTICS_BY_TREATMENT_HASH),
              partialExposure.treatmentHash
            )
          ),
          faunadbQuery.Lambda('X', faunadbQuery.Update(
            faunadbQuery.Var('X'), {
            data: {
              exposureCount: faunadbQuery.Add(
                faunadbQuery.Select(['data', 'exposureCount'], faunadbQuery.Get(faunadbQuery.Var('X'))),
                1
              )
            }
          }
          ))
        );

        const saveExposure = faunadbQuery.Create(
          faunadbQuery.Collection(COLLECTIONS.EXPOSURES),
          { data: partialExposure }
        );

        /* https://docs.fauna.com/fauna/current/api/fql/functions/do?lang=javascript
         *
         * If all of the expressions executed by Do succeed,
         * only the results of the last statements executed are returned.
         * If no expressions are provided, Do returns an error.
         */

        const transaction = faunadbClient.query(
          faunadbQuery.Do(
            updateExposureCount,
            saveExposure // Order is important
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
