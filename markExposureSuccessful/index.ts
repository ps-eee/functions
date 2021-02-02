import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { COLLECTIONS } from '../constants/collections';
import { faunadbClient, faunadbQuery } from '../constants/faunadb';
import { Exposure } from '../interfaces/exposure';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  if (req.method === 'PUT') {

    if (req.body && req.body.id) {

      try {

        const exposureId: Exposure['id'] = req.body.id;

        const saveExposure = faunadbClient.query(
          faunadbQuery.Update(
            faunadbQuery.Ref(
              faunadbQuery.Collection(COLLECTIONS.EXPOSURES), exposureId
            ),
            { data: { isSuccessful: true } }
          )
        );

        await saveExposure;

        context.res = { status: 201, body: null };

      } catch (error) {

        context.log(error);

        context.res = { status: 500, body: null };

      }

    } else { context.res = { status: 400, body: null }; }

  } else { context.res = { status: 404, body: null }; }

};

export default httpTrigger;
