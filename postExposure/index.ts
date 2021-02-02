import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as faunadb from 'faunadb';
import { Exposure } from '../interfaces/exposure';
import { KEYS } from '../keys';

const faunadbClient = new faunadb.Client({ secret: KEYS.FAUNDADB_KEY })
const faunadbQuery = faunadb.query;

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  if (req.method === 'POST') {

    if (req.body && req.body.timestamp && req.body.treatmentHash && req.body.userId) {

      try {

        const partialExposure: Omit<Exposure, 'id'> = {
          isSuccessful: false,
          ...req.body
        };

        // TODO: DB - transaction(save exposure and update treatmentStatictic.exposureCount) and return exposure

        const exposure: Exposure = { id: null, ...partialExposure };

        context.res = { status: 201, body: exposure };

      } catch (error) {

        context.log(error);

        context.res = { status: 500, body: null };

      }

    } else { context.res = { status: 400, body: null }; }

  } else { context.res = { status: 404, body: null }; }

};

export default httpTrigger;
