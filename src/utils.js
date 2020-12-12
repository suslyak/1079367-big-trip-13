// from you dont need lodash underscore
export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (arr) => arr[randomInt(0, arr.length - 1)];

export const sortByStartDates = (a, b) => {
  // сортирует объекты dayjs

  if (a.start.isBefore(b.start)) {
    return -1;
  }
  if (b.start.isBefore(a.start)) {
    return 1;
  }

  return 0;
};

export const sortByPrice = (a, b) => {
  // сортирует объекты, имеющие свойство cost

  if (b.cost < a.cost) {
    return -1;
  }
  if (b.cost > a.cost) {
    return 1;
  }

  return 0;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const renderElement = (container, element, place) => {
  if (typeof (place) === `string`) {
    switch (place) {
      case RenderPosition.AFTERBEGIN:
        container.prepend(element);
        break;
      case RenderPosition.BEFOREEND:
        container.append(element);
        break;
    }
  }

  if (typeof (place) === `object`) {
    container.insertBefore(element, place);
  }
};

// Пока оставлю эту фнкцию, для возможности рендерить разное барахло,
// передавая в неё результат метода getTemplate view-класса, вместо getElement.
// renderTemplate(контейнер, КлассТеплейта.getTemplate() , место)
export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};
