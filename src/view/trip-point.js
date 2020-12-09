const getDuration = (start, end) => {
  const termDays = end.diff(start, `days`);
  const termHours = end.diff(start, `hours`) - termDays * 24;
  const termMinutes = end.diff(start, `minutes`) - (termHours + termDays * 24) * 60;
  return [
    termDays ? `${termDays.toString().padStart(2, `0`)}D` : ``,
    (termDays || termHours) ? `${termHours.toString().padStart(2, `0`)}H` : ``,
    `${termMinutes.toString().padStart(2, `0`)}M`
  ]
  .filter((term) => term).join(` `);
};

const getOffers = (offers) => {
  return offers.reduce((offersListElements, offer) => (
    offersListElements + `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.cost}</span>
    </li>`
  ), ``);
};

const getOffersTemplate = (offers) => {
  if (offers.length > 0) {
    return `
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getOffers(offers)}
      </ul>`;
  }

  return ``;
};

export const getPiontTemplate = (point) => {
  const {
    pointType,
    offers,
    destination,
    start,
    end,
    cost,
    favorite,
  } = point;

  return `
    <li class="trip-events__item">
      <div class="event">
      <time class="event__date" datetime="${start.format(`YYYY-MM-DDTHH:mm`)}">${start.format(`MMM DD`)}</time>
      <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${pointType} ${destination.name}</h3>
      <div class="event__schedule">
          <p class="event__time">
          <time class="event__start-time" datetime="${start.format(`YYYY-MM-DDTHH:mm`)}">${start.format(`HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${end.format(`YYYY-MM-DDTHH:mm`)}">${end.format(`HH:mm`)}</time>
          </p>
          <p class="event__duration">${getDuration(start, end)}</p>
      </div>
      <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${cost}</span>
      </p>
        ${getOffersTemplate(offers)}
      <button class="event__favorite-btn ${favorite ? `event__favorite-btn--active` : `` }" type="button">
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
