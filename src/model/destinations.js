import Observer from "../utils/observer.js";

export default class Destination extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations.slice();

    this._notify(updateType);
  }

  getDestinations() {
    return this._destinations.length ? this._destinations : [{name: `loading destinations..`, description: {text: ``, pictures: []}}];
  }

  static adaptToClient(destination) {
    const adaptedDestination = Object.assign(
        {},
        destination,
        {
          description: {
            text: destination.description,
            pictures: destination.pictures
          }
        }
    );

    delete adaptedDestination.pictures;

    return adaptedDestination;
  }

  // в рамках ТЗ не понадобится
  static adaptToServer(destination) {
    const adaptedDestination = Object.assign(
        {},
        destination,
        {
          description: destination.description.text,
          pictures: destination.description.pictures
        }
    );

    return adaptedDestination;
  }
}
