import PointsModel from '../model/points.js';
import DestinationsModel from '../model/destinations.js';
import OffersModel from '../model/offers.js';
import {isOnline} from "../utils/common.js";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createPointsStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const createCommonStructure = (items) => {
  return items.reduce((acc, current, index) => {
    return Object.assign({}, acc, {
      [index]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, pointsStore, destinationsStore, offersStore) {
    this._api = api;
    this._pointsStore = pointsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
    this._needSync = false;
  }

  getTripPoints() {
    if (isOnline()) {
      return this._api.getTripPoints()
        .then((points) => {
          const items = createPointsStoreStructure(points.map(PointsModel.adaptToServer));
          this._pointsStore.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._pointsStore.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createCommonStructure(destinations.map(DestinationsModel.adaptToServer));
          this._destinationsStore.setItems(items);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._destinationsStore.getItems());

    return Promise.resolve(storeDestinations.map(DestinationsModel.adaptToClient));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createCommonStructure(offers.map(OffersModel.adaptToServer));
          this._offersStore.setItems(items);
          return offers;
        });
    }

    const storeOffers = Object.values(this._offersStore.getItems());

    return Promise.resolve(storeOffers.map(OffersModel.adaptToClient));
  }

  updateTripPoint(point) {
    if (isOnline()) {
      return this._api.updateTripPoint(point)
        .then((updatedPoint) => {
          this._pointsStore.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._pointsStore.setItem(point.id, PointsModel.adaptToServer(Object.assign({offlined: true}, point)));

    this._needSync = true;

    return Promise.resolve(point);
  }

  addTripPoint(point) {
    if (isOnline()) {
      return this._api.addTripPoint(point)
        .then((newPoint) => {
          this._pointsStore.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    this._pointsStore.setItem(point.id, PointsModel.adaptToServer(Object.assign({offlined: true}, point)));

    this._needSync = true;

    return Promise.resolve(point);
  }

  deleteTripPoint(point) {
    if (isOnline()) {
      return this._api.deleteTripPoint(point)
        .then(() => this._pointsStore.removeItem(point.id));
    }

    this._pointsStore.removeItem(point.id);

    this._needSync = true;

    return Promise.resolve();
  }

  _checkIfNeedSync() {
    this._needSync = Object.values(this._pointsStore.getItems())
        .some((item) => item.hasOwnProperty(`offlined`) && item.offlined === true);
    return;
  }

  sync(modelCallback) {
    this._checkIfNeedSync();

    if (!this._needSync) {
      return Promise.resolve(new Error(`No need to sync`));
    }

    if (isOnline()) {
      const pointsToDeoffline = [];
      const storePoints = Object.values(this._pointsStore.getItems())
          .map((point) => {
            if (point.hasOwnProperty(`offlined`)) {
              delete point.offlined;
              pointsToDeoffline.push(point.id);
            }

            return point;
          });

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createPointsStoreStructure([...createdPoints, ...updatedPoints]);

          this._pointsStore.setItems(items);

          modelCallback(pointsToDeoffline);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
