import TripInfo from './view/trip-info.js';
import TripCost from './view/trip-cost.js';
import Menu from './view/main-menu.js';
import Filter from './view/trip-filters.js';
import Sorting from './view/trip-sort.js';
import Events from './view/trip-events.js';
import EditPointForm from './view/edit-trip-point.js';
import TripPoint from './view/trip-point.js';
import {getNavigationLinks} from './mock/navigation.js';
import {generatePoint} from './mock/trip-point.js';
import {generateFilter} from './mock/filter.js';
import {generateSorting} from './mock/sortings.js';

import {sortByStartDates} from './utils/point.js';
import {render, replace} from './utils/render.js';

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const eventsElement = pageMainElement.querySelector(`.trip-events`);

const tripPoints = new Array(20).fill().map(generatePoint);
const destinations = Array.from(new Set(tripPoints.map((point) => point.destination.name)));

destinations.sort();
tripPoints.sort(sortByStartDates);

const tripDestinationsGraph = Array.from(new Set(tripPoints.map((point) => point.destination.name)));
const tripTimeGap = {
  start: tripPoints[0].start,
  end: tripPoints.slice(-1)[0].end
};

const tripCost = tripPoints.reduce((total, point) => total + point.cost, 0);

render(tripMainElement, new TripInfo(tripDestinationsGraph, tripTimeGap), `afterbegin`);

const tripInfoElement = pageHeaderElement.querySelector(`.trip-info`);

render(tripInfoElement, new TripCost(tripCost), `beforeend`);

const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];

render(tripControlsElement, new Menu(getNavigationLinks()), menuReferenceElement);
render(tripControlsElement, new Filter(generateFilter(tripPoints)), `beforeend`);
render(eventsElement, new Sorting(generateSorting(tripPoints)), `beforeend`);
render(eventsElement, new Events(), `beforeend`);

const tripEventsListElement = eventsElement.querySelector(`.trip-events__list`);

for (const tripPoint of tripPoints) {
  const EditPointFormComponent = new EditPointForm(tripPoint);
  const TripPointComponent = new TripPoint(tripPoint);

  TripPointComponent.setEditClickHandler(() => {
    replace(EditPointFormComponent, TripPointComponent);
  });

  EditPointFormComponent.setEditClickHandler(() => {
    replace(TripPointComponent, EditPointFormComponent);
  });

  render(tripEventsListElement, TripPointComponent, `beforeend`);
}
