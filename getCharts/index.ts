import { AzureFunction, Context } from '@azure/functions';
import { faunadbClient, faunadbQuery } from '../constants/faunadb';
import { INDEXES } from '../constants/indexes';

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {

  const getExposures = faunadbClient.query(
    faunadbQuery.Paginate(
      faunadbQuery.Match(
        faunadbQuery.Index(INDEXES.ALL_EXPOSURES)
      ),
      {
        size: 500,
        // after: [
        //   "2021-02-05T09:56:23.733Z",
        //   "a975ddfc5dd91b21581cd28bf578e7f31fa93d5e",
        //   faunadbQuery.Ref(faunadbQuery.Collection("exposures"), "289679746491482629")
        // ]
      }
    )
  );

  const exposures = (await getExposures)['data'];

  const chartData = [];
  const chartLayout = {
    xaxis: { title: 'Time', showticklabels: false },
    yaxis: { title: 'Cumulative Count' }
  };
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
    <title>Shoe Souq - Charts</title>
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
    <h1>Exposures over Time (Upper Confidence Bound)</h1>
    <div id='chart'></div>
    <script>

      Plotly.newPlot('chart', ${JSON.stringify(chartData)}, ${JSON.stringify(chartLayout)});

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
