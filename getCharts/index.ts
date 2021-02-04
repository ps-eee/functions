import { AzureFunction, Context } from '@azure/functions';
import { faunadbClient, faunadbQuery } from '../constants/faunadb';
import { INDEXES } from '../constants/indexes';

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {

  const getExposures = faunadbClient.query(
    faunadbQuery.Paginate(
      faunadbQuery.Match(
        faunadbQuery.Index(INDEXES.ALL_EXPOSURES)
      ),
      { size: 200 }
    )
  );

  const exposures = (await getExposures)['data'];

  const timestamps = [];
  const treatmentHashes = [];
  exposures.forEach(i => { timestamps.push(i[0]); treatmentHashes.push(i[1]); });

  const chartData = [];

  for (let i = 0; i < treatmentHashes.length; i++) {

    const cumulativeOccurrenceCount = [];

    for (let j = 0; j < treatmentHashes.length; j++) {

      const lastValue = cumulativeOccurrenceCount[cumulativeOccurrenceCount.length - 1] || 0;

      const value = treatmentHashes[i] === treatmentHashes[j] ? lastValue + 1 : lastValue;

      cumulativeOccurrenceCount.push(value);

    }

    chartData.push({
      x: timestamps,
      y: cumulativeOccurrenceCount,
      type: 'scatter'
    });

  }

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
