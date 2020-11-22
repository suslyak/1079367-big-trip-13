import tripInfoView from './view/trip-info.js';
import tripCostView from './view/trip-cost.js';
import mainMenuView from './view/main-menu.js';
import tripFiltersView from './view/trip-filters.js';
import tripSortView from './view/trip-sort.js';
import createPointView from './view/create-trip-point.js';
import editPointView from './view/edit-trip-point.js';
import tripPoint from './view/trip-point.js';

const newTripInfoView = tripInfoView()();
const newTripCostView = tripCostView()();
const newMainMenuView = mainMenuView()();
const newTripFiltersView = tripFiltersView()();
const newTripSortView = tripSortView()();
const newCreatePointView = createPointView()();
const newEditPointView = editPointView()();
const newTripPoint = tripPoint()();

const pageHeaderElement = document.querySelector(`.page-header`);
const tripInfoElement = pageHeaderElement.querySelector(`.trip-info__main`);
const tripCostElement = pageHeaderElement.querySelector(`.trip-info__cost`);
const menuElement = pageHeaderElement.querySelector(`nav`);
const filtersElement = pageHeaderElement.querySelector(`.trip-filters`);
const pageMainElement = document.querySelector(`.page-main`);
const sortElement = pageMainElement.querySelector(`.trip-sort`);
const eventsListElement = pageMainElement.querySelector(`.trip-events__list`);

let veiwsToRender = [
  {
    view: newTripInfoView,
    container: tripInfoElement
  },
  {
    view: newTripCostView,
    container: tripCostElement
  },
  {
    view: newMainMenuView,
    container: menuElement
  },
  {
    view: newTripFiltersView,
    container: filtersElement
  },
  {
    view: newTripSortView,
    container: sortElement
  },
  {
    view: newCreatePointView,
    container: eventsListElement
  },
  {
    view: newEditPointView,
    container: eventsListElement
  },
  {
    view: newTripPoint,
    container: eventsListElement
  },
  {
    view: newTripPoint,
    container: eventsListElement
  },
  {
    view: newTripPoint,
    container: eventsListElement
  }
];

const render = (view, container) => {
  container.innerHTML += view.getRawHtmlTemplate();

};

veiwsToRender.forEach((objectToRender) => {
  render(objectToRender.view, objectToRender.container);
});

