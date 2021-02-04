import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { COLLECTIONS } from '../constants/collections';
import { faunadbClient, faunadbQuery } from '../constants/faunadb';
import { INDEXES } from '../constants/indexes';
import { Exposure } from '../interfaces/exposure';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  if (req.method === 'PUT') {

    if (req.body && req.body.hasOwnProperty('id') && req.body.hasOwnProperty('isSuccessful') && req.body.hasOwnProperty('timestamp') && req.body.hasOwnProperty('treatmentHash') && req.body.hasOwnProperty('userId')) {

      try {

        const exposure: Exposure = req.body;

        const updateTreatmentStatistic = faunadbQuery.Map(
          faunadbQuery.Paginate(
            faunadbQuery.Match(
              faunadbQuery.Index(INDEXES.ALL_TREATMENT_STATISTICS_BY_TREATMENT_HASH),
              exposure.treatmentHash
            )
          ),
          faunadbQuery.Lambda('X', faunadbQuery.Update(
            faunadbQuery.Var('X'), {
            data: {
              successCount: faunadbQuery.Add(
                faunadbQuery.Select(['data', 'successCount'], faunadbQuery.Get(faunadbQuery.Var('X'))),
                1
              )
            }
          }
          ))
        );

        const updateExposure = faunadbQuery.Update(
          faunadbQuery.Ref(
            faunadbQuery.Collection(COLLECTIONS.EXPOSURES), exposure.id
          ),
          { data: { isSuccessful: true } }
        );

        const transaction = faunadbClient.query(
          faunadbQuery.Do(
            updateTreatmentStatistic,
            updateExposure,
          )
        )

        await transaction;

        context.res = { status: 201, body: null };

      } catch (error) {

        context.log(error);

        context.res = { status: 500, body: null };

      }

    } else { context.res = { status: 400, body: null }; }

  } else { context.res = { status: 404, body: null }; }

};

export default httpTrigger;
