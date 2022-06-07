# Highcharts Demo

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## When you start, you will need to do this!

Once running, it might not load the chart (white screen, errors in the console)
Comment out 3 chunks of code:

1.)
``` 
 const dates = chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[0]["request.time"].buckets.map(x => x.key_as_string)
    const shortendDates = [];

    // from ISO -> UTC format
    dates.forEach(element => {
        const UTC = new Date(element).toUTCString().substring(0, 16)
        shortendDates.push(UTC)
    });
```

2.)
```
categories: shortendDates

```

3.)
```  {
                // LTL_TRACKING
                name: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[0].key,
                data: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[0]["request.time"].buckets.map(x => x["duration_ms|percentiles"].values["90.0"])
            },
            {
                // TL_TRACKING
                name: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[1].key,
                data: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[1]["request.time"].buckets.map(x => x["duration_ms|percentiles"].values["90.0"])
            },
            {
                //POST_IMPORT_CARRIER
                name: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[2].key,
                data: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[2]["request.time"].buckets.map(x => x["duration_ms|percentiles"].values["90.0"])
            },
            {
                //POST_IMPORT_LOAD
                name: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[3].key,
                data: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[3]["request.time"].buckets.map(x => x["duration_ms|percentiles"].values["90.0"])
            },
            {
                //POST_DISPATCH
                name: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[4].key,
                data: chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[4]["request.time"].buckets.map(x => x["duration_ms|percentiles"].values["90.0"])
            },
```

Once you save while the chunks of code are commented out, you should see a yellow message in the console. Now you are able to uncomment the chunks of code and save again, then the chart should appear.

There are also commented out console logs in case you want to see more the response structure from Moesif.

