import React, { useState, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const ChartData = () => {
    const [chart, setChart] = useState({})
    var baseUrl = "https://api.moesif.com/v1/search/~/search/events?from=-7d&to=now&time_zone=America%2FNew_York&week_starts_on=1";
    var apiKey = "";


    useEffect(() => {
        const fetchData = async () => {
            await fetch(`${baseUrl}`, {
                method: 'POST',
                headers: {
                    Authorization: `${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // body: ({
                    "post_filter": {
                        "terms": {
                            "event_type.raw": [
                                "api_call"
                            ]
                        }
                    },
                    "aggs": {
                        "entTmSrs": {
                            "filter": {
                                "terms": {
                                    "event_type.raw": [
                                        "api_call"
                                    ]
                                }
                            },
                            "aggs": {
                                "metadata.inboundType.raw": {
                                    "terms": {
                                        "field": "metadata.inboundType.raw",
                                        "size": 5,
                                        "min_doc_count": 1,
                                        "missing": "(none)"
                                    },
                                    "aggs": {
                                        "request.time": {
                                            "date_histogram": {
                                                "field": "request.time",
                                                "interval": "1d",
                                                "time_zone": "America/New_York"
                                            },
                                            "aggs": {
                                                "duration_ms|percentiles": {
                                                    "percentiles": {
                                                        "field": "duration_ms",
                                                        "percents": [
                                                            90
                                                        ]
                                                    }
                                                }
                                            }
                                        },
                                        "duration_ms|percentiles": {
                                            "percentiles": {
                                                "field": "duration_ms",
                                                "percents": [
                                                    90
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "size": 0
                }
                )
            }
            )
                .then((response) => {
                    if (response.ok) {
                        response.json().then((json) => {
                            setChart(json)
                        }).catch((error) => {
                            console.log(error);
                        });
                    }
                })
        }

        fetchData()
    }, [baseUrl, apiKey])

    //  console.log("chart", chart);

    // const companies = chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets.map(x => x.key);
    // console.log(companies); 

    // console.log("bucket", chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets)

    // console.log("number", chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[0]["duration_ms|percentiles"].values["90.0"])
    // ^^ SINGLE NUMBER

    // console.log("number", chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[0]["request.time"].buckets.map(x => x["duration_ms|percentiles"].values["90.0"]))
    // 7 DAY NUMBER FOR SINGLE COMPANY

    // console.log("experimental", chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[0]["request.time"].buckets.map(x => x.key_as_string))
    // ^^ DATES



    const dates = chart.aggregations.entTmSrs["metadata.inboundType.raw"].buckets[0]["request.time"].buckets.map(x => x.key_as_string)
    const shortendDates = [];

    // from ISO -> UTC format
    dates.forEach(element => {
        const UTC = new Date(element).toUTCString().substring(0, 16)
        shortendDates.push(UTC)
    });

    

    const options = {
        title: {
            text: 'Response Times Report'
        },
        xAxis: {
            categories: shortendDates
        },
        yAxis: {
            title: {
                text: 'P90 Latency (Miliseconds)'
            }
        },
        series: [
            {
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
        ]

    }

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}

export default ChartData;