import dayjs from 'dayjs';

import Observer from '../utils/observer.js';

export default class Point extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  getEmptyPoint() {
    return {
      id: ``,
      pointType: `flight`,
      selectedOffers: [],
      destination: {},
      start: dayjs(),
      end: dayjs().add(1, `minute`),
      cost: ``,
      favorite: false,
    };
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          pointType: point.type,
          selectedOffers: point.offers
            ? point.offers
                .map((offer) => ({
                  name: point.type,
                  title: offer.title,
                  cost: offer.price.toString()
                }))
            : [],
          destination: point.destination
            ? {
              name: point.destination.name,
              description: {
                text: point.destination.description,
                pictures: point.destination.pictures
              }
            }
            : {},
          start: point.date_from !== null ? dayjs(point.date_from) : point.date_from,
          end: point.date_to !== null ? dayjs(point.date_to) : point.date_to,
          cost: point.base_price.toString(),
          favorite: point.is_favorite
        }
    );

    delete adaptedPoint.type;
    delete adaptedPoint.offers;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          type: point.pointType,
          offers: point.selectedOffers !== null
            ? point.selectedOffers
                .map((offer) => ({
                  title: offer.title,
                  price: parseInt(offer.cost, 10)
                }))
            : point.selectedOffers,
          destination: point.destination !== null
            ? {
              name: point.destination.name,
              description: point.destination.description.text,
              pictures: point.destination.description.pictures
            }
            : point.destination,
          date_from: point.start !== null ? point.start.toISOString() : point.start,
          date_to: point.end !== null ? point.end.toISOString() : point.end,
          base_price: parseInt(point.cost, 10),
          is_favorite: point.favorite
        }
    );

    delete adaptedPoint.pointType;
    delete adaptedPoint.selectedOffers;
    delete adaptedPoint.start;
    delete adaptedPoint.end;
    delete adaptedPoint.cost;
    delete adaptedPoint.favorite;

    return adaptedPoint;
  }
}
