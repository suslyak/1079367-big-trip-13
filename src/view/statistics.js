import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import AbstractView from './abstract.js';
import {TripPointTypes} from '../const.js';

const BAR_HEIGHT = 55;

const chartLabels = TripPointTypes.map((type) => type.toUpperCase());

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
  const chartMoneys = TripPointTypes
    .map((type) => points
      .filter((point) => point.pointType === type)
        .reduce((total, point) => total + point.cost, 0));

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartMoneys,
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
          minBarLength: 50
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
      barThickness: 44
    }
  });
};

const renderTypeChart = (typeCtx, points) => {
  const chartCounts = TripPointTypes
    .map((type) => points
      .filter((point) => point.pointType === type).length);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartCounts,
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
          minBarLength: 50
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
      barThickness: 44
    }
  });
};

const renderTimeChart = (timeCtx, points) => {
  const chartDays = TripPointTypes
  .map((type) => points
    .filter((point) => point.pointType === type)
      .reduce((total, point) => total + point.end.diff(point.start, `hour`), 0));

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartDays,
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
          minBarLength: 50
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
      barThickness: 44
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

  setCharts(poits) {
    if (this._typeCart !== null || this._moneyChart !== null || this._timeChart !== null) {
      this._typeCart = null;
      this._moneyChart = null;
      this._timeChart = null;
    }

    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const typeCtx = document.querySelector(`.statistics__chart--transport`);
    const timeCtx = document.querySelector(`.statistics__chart--time`);

    moneyCtx.height = BAR_HEIGHT * 10;
    typeCtx.height = BAR_HEIGHT * 10;
    timeCtx.height = BAR_HEIGHT * 10;

    this._moneyCart = renderMoneyChart(moneyCtx, poits);
    this._typeChart = renderTypeChart(typeCtx, poits);
    this._timeCtx = renderTimeChart(timeCtx, poits);
  }
}
