import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as faunadb from 'faunadb';
import { Exposure } from '../interfaces/exposure';
import { KEYS } from '../keys';

const faunadbClient = new faunadb.Client({ secret: KEYS.FAUNDADB_KEY })
const faunadbQuery = faunadb.query;

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  if (req.method === 'PUT') {

    if (req.body && req.body.id && Number.isInteger(Number(req.body.id)) && Number(req.body.id) >= 0) {

      try {

        const exposureId: Exposure['id'] = Number(req.body.id);

        const partialExposure: Pick<Exposure, 'isSuccessful'> = { isSuccessful: true };

        // TODO: DB - update exposure

        context.res = { status: 201, body: null };

      } catch (error) {

        context.log(error);

        context.res = { status: 500, body: null };

      }

    } else { context.res = { status: 400, body: null }; }

  } else { context.res = { status: 404, body: null }; }

};

export default httpTrigger;
