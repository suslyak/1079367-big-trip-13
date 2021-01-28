import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import AbstractView from './abstract.js';
import {ChartParameter} from '../const.js';

const createStatisticsTemplate = () => {
  return `
    <section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`;
};

const renderMoneyChart = (moneyCtx, points) => {
  const chartMoneys = points
  .reduce((total, point) => Object.assign(
      {},
      total,
      {
        [point.pointType]: total[point.pointType] ? total[point.pointType] + point.cost : point.cost
      }), {});

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(chartMoneys),
      datasets: [{
        data: Object.values(chartMoneys),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: ChartParameter.MIN_BAR_LENGTH
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    },
    dataset: {
      barThickness: ChartParameter.BAR_THICKNESS
    }
  });
};

const renderTypeChart = (typeCtx, points) => {
  const chartCounts = points
  .reduce((total, point) => Object.assign(
      {},
      total,
      {
        [point.pointType]: total[point.pointType] ? ++total[point.pointType] : 1
      }), {});

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(chartCounts),
      datasets: [{
        data: Object.values(chartCounts),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: ChartParameter.MIN_BAR_LENGTH
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    },
    dataset: {
      barThickness: ChartParameter.BAR_THICKNESS
    }
  });
};

const renderTimeChart = (timeCtx, points) => {
  const chartHours = points
  .reduce((total, point) => Object.assign(
      {},
      total,
      {
        [point.pointType]: total[point.pointType]
          ? total[point.pointType] + point.end.diff(point.start, `hour`)
          : point.end.diff(point.start, `hour`)
      }), {});

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(chartHours),
      datasets: [{
        data: Object.values(chartHours),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME-SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: ChartParameter.MIN_BAR_LENGTH
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    },
    dataset: {
      barThickness: ChartParameter.BAR_THICKNESS
    }
  });
};

export default class Statistics extends AbstractView {
  constructor() {
    super();

    this._typeCart = null;
    this._moneyChart = null;
    this._timeChart = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  setCharts(points) {
    if (this._typeCart !== null || this._moneyChart !== null || this._timeChart !== null) {
      this._typeCart = null;
      this._moneyChart = null;
      this._timeChart = null;
    }

    const moneyCtxElement = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtxElement = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtxElement = this.getElement().querySelector(`.statistics__chart--time`);

    const numberOfTypes = Array.from(new Set(points.map((point) => point.pointType))).length;

    moneyCtxElement.height = ChartParameter.BAR_HEIGHT * numberOfTypes;
    typeCtxElement.height = ChartParameter.BAR_HEIGHT * numberOfTypes;
    timeCtxElement.height = ChartParameter.BAR_HEIGHT * numberOfTypes;

    this._moneyCart = renderMoneyChart(moneyCtxElement, points);
    this._typeChart = renderTypeChart(typeCtxElement, points);
    this._timeCtx = renderTimeChart(timeCtxElement, points);
  }
}
