import InfoPresenter from './presenter/info.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import SiteMenu from './view/main-menu.js';
import {render} from './utils/render.js';
import Api from './api/api.js';
import {UpdateType, MenuItem} from './const.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = `Basic iHG6PGr3zNtg`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const POINTS_STORE_PREFIX = `big-trip-points-localstorage`;
const DESTINATIONS_STORE_PREFIX = `big-trip-destinations-localstorage`;
const OFFERS_STORE_PREFIX = `big-trip-offers-localstorage`;
const STORE_VER = `v13`;
const POINTS_STORE_NAME = `${POINTS_STORE_PREFIX}-${STORE_VER}`;
const DESTINATIONS_STORE_NAME = `${DESTINATIONS_STORE_PREFIX}-${STORE_VER}`;
const OFFERS_STORE_NAME = `${OFFERS_STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const pointsStore = new Store(POINTS_STORE_NAME, window.localStorage);
const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, pointsStore, destinationsStore, offersStore);

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];
const mainContainerElement = pageMainElement.querySelector(`.page-body__container`);
const eventsElement = mainContainerElement.querySelector(`.trip-events`);

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const siteMenu = new SiteMenu(Object.values(MenuItem));

const headerRenderPlaces = {
  menu: {container: tripControlsElement, referenceElement: menuReferenceElement},
  filter: tripControlsElement
};

const newPointClickHandler = (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
};

const renderMenu = () => {
  const container = headerRenderPlaces.menu.container;
  const position = headerRenderPlaces.menu.referenceElement;
  render(container, siteMenu, position);
};

const createInfo = () => {
  const infoPresenter = new InfoPresenter(tripMainElement, headerRenderPlaces, pointsModel, filterModel);
  const newPointButton = document.querySelector(`.trip-main__event-add-btn`);

  infoPresenter.init();
  renderMenu();

  newPointButton.removeEventListener(`click`, newPointClickHandler);
  newPointButton.addEventListener(`click`, newPointClickHandler);
};

const tripPresenter = new TripPresenter(eventsElement, siteMenu, pointsModel, destinationsModel, offersModel, filterModel, apiWithProvider);

destinationsModel.loading = true;
offersModel.loading = true;

tripPresenter.init();

apiWithProvider.getTripPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  })
  .finally(() => {
    createInfo();
  });

apiWithProvider.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestinations(UpdateType.INIT, destinations);
  }).catch(() => {
    destinationsModel.setDestinations(UpdateType.INIT, []);
  });

apiWithProvider.getOffers()
  .then((offers) => {
    offersModel.setOffers(UpdateType.INIT, offers);
  }).catch(() => {
    offersModel.setOffers(UpdateType.INIT, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/service-worker.js`);
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});
