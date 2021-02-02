import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Exposure } from '../interfaces/exposure';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  if (req.method === 'POST') {

    if (req.body && req.body.timestamp && req.body.treatmentHash && req.body.userId) {

      try {

        const exposure: Exposure = {
          id: null,
          isSuccessful: false,
          ...req.body
        };

        // TODO: DB - save exposure and update treatmentStatictic.exposureCount transaction and return ID

        context.res = { status: 201, body: exposure };

      } catch (error) {

        context.log(error);

        context.res = { status: 500, body: null };

      }

    } else { context.res = { status: 400, body: null }; }

  } else { context.res = { status: 404, body: null }; }

};

export default httpTrigger;
