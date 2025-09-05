import {
  GenericChartData,
  ChartType,
  ViewType,
} from '../models/generic-chart.models';

export const data: GenericChartData = {
  series: [
    {
      category: 'Grapes',
      points: [
        { x: '2010-01-15', y: 120 },
        { x: '2011-03-10', y: 200 },
        { x: '2012-06-05', y: 320 },
        { x: '2013-09-20', y: 400 },
        { x: '2014-12-31', y: 180 },
        { x: '2015-02-14', y: 250 },
        { x: '2016-05-17', y: 600 },
        { x: '2017-08-12', y: 450 },
        { x: '2018-11-06', y: 900 },
        { x: '2019-04-25', y: 700 },
        { x: '2020-07-13', y: 1200 },
        { x: '2021-10-19', y: 1100 },
      ],
    },
    {
      category: 'Berries',
      points: [
        { x: '2010-02-07', y: 80 },
        { x: '2011-05-15', y: 500 },
        { x: '2012-08-22', y: 200 },
        { x: '2013-11-10', y: 900 },
        { x: '2014-03-04', y: 400 },
        { x: '2015-06-28', y: 1200 },
        { x: '2016-09-16', y: 700 },
        { x: '2017-12-30', y: 300 },
        { x: '2018-03-31', y: 600 },
        { x: '2019-06-15', y: 950 },
        { x: '2020-09-20', y: 1100 },
        { x: '2021-12-31', y: 0 },
      ],
    },
  ],
  options: {
    title: 'Fruit Sales',
    legend: true,
    type: ChartType.Line,
    smooth: true,
    viewType: ViewType.Month,
  },
};
