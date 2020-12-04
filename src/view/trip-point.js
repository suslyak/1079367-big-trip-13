const getOffers = (offers) => {
  let offerListItemEliments = ``;
  for (const offer of offers) {
    offerListItemEliments += `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.cost}</span>
      </li>`;
  }

  return offerListItemEliments;
};

export const getPiontTemplate = (point) => {
  return `
    <li class="trip-events__item">
      <div class="event">
      <time class="event__date" datetime="${point.startDate.format(`YYYY-MM-DDTHH:mm`).toString()}">${point.startDate.format(`MMM DD`)}</time>
      <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="${point.eventTypeIcon}" alt="Event type icon">
      </div>
      <h3 class="event__title">${point.eventType} ${point.destination.name}</h3>
      <div class="event__schedule">
          <p class="event__time">
          <time class="event__start-time" datetime="${point.startDate.format(`YYYY-MM-DDTHH:mm`).toString()}">${point.startDate.format(`HH:mm`).toString()}</time>
          &mdash;
          <time class="event__end-time" datetime="${point.endDate.format(`YYYY-MM-DDTHH:mm`).toString()}">${point.endDate.format(`HH:mm`).toString()}</time>
          </p>
          <p class="event__duration">${point.duration}</p>
      </div>
      <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.cost}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getOffers(point.offers)}
      </ul>
      <button class="event__favorite-btn ${point.favorite ? `event__favorite-btn--active` : `` }" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
      </button>
      <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
      </button>
      </div>
    </li>`;
};
