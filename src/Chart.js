import React, {Component} from 'react';
import FusionCharts from 'fusioncharts';
import TimeSeries from 'fusioncharts/fusioncharts.timeseries';
import ReactFC from 'react-fusioncharts'

ReactFC.fcRoot(FusionCharts, TimeSeries);

class Chart extends Component {

    render() {
        let chartConfigs = {
            type: 'timeseries',
            datasource: {
                chart: {
                    caption: { text: this.props.caption },
                    numbersuffix: this.props.unit,
                    includevalueinlabels: '1',
                    labelsepchar: ': ',
                    entityFillHoverColor: '#FFF9C4',
                    theme: 'fusion'
                },
                colorrange: {
                    minvalue: '0',
                    code: '#FFE0B2',
                    gradient: '1',
                    color: [
                        { minvalue: '0.5', maxvalue: '1.0', color: '#FFD74D' },
                        { minvalue: '1.0', maxvalue: '2.0', color: '#FB8C00' },
                        { minvalue: '2.0', maxvalue: '3.0', color: '#E65100' }
                    ]
                },

                data: this.props.data,
                yAxis: [{
                    plot: [{
                        value: this.props.name
                    }]
                }]
            }
        }
        return <ReactFC {...chartConfigs}></ReactFC>
    }
}