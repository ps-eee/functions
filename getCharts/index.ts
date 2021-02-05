import { AzureFunction, Context } from '@azure/functions';
import { faunadbClient, faunadbQuery } from '../constants/faunadb';
import { INDEXES } from '../constants/indexes';

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {

  const getExposures = faunadbClient.query(
    faunadbQuery.Paginate(
      faunadbQuery.Match(
        faunadbQuery.Index(INDEXES.ALL_EXPOSURES)
      ),
      { size: 300 }
    )
  );

  const exposures = (await getExposures)['data'];

  const chartData = [];
  const treatmentHashMap = {};

  for (let exposure of exposures) {

    const timestamp = exposure[0];

    const treatmentHash = exposure[1];

    if (!treatmentHashMap.hasOwnProperty(treatmentHash)) {

      treatmentHashMap[treatmentHash] = {
        x: [timestamp],
        y: [1],
        type: 'scatter'
      }

    } else {

      const cumulativeOccurrenceCounts = treatmentHashMap[treatmentHash]['y'];

      treatmentHashMap[treatmentHash]['x'].push(timestamp);
      cumulativeOccurrenceCounts.push(cumulativeOccurrenceCounts[cumulativeOccurrenceCounts.length - 1] + 1);

    }

  }

  for (let key in treatmentHashMap) { chartData.push(treatmentHashMap[key]); }

  const html = `
  <!doctype html>
  <html lang="en">

  <head>
    <meta charset="utf-8">
    <title>Shoe Souq</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        padding: 24px;
      }
    </style>
    <script src='https://cdn.plot.ly/plotly-latest.min.js'></script>
  </head>

  <body>
    <div id='chart'></div>
    <script>

      Plotly.newPlot('chart', ${JSON.stringify(chartData)});

    </script>
  </body>

  </html>
  `;

  context.res = {
    status: 200,
    body: html,
    headers: { 'Content-Type': 'text/html' }
  };

};

export default httpTrigger;
