import dayjs from "dayjs";

// from you dont need lodash underscore
export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (arr) => arr[randomInt(0, arr.length - 1)];

const MOCK_TEXT = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.\
  Cras aliquet varius magna, non porta ligula feugiat eget.\
  Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.\
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris,\
  condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus,\
  purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit\
  in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.\
  In rutrum ac purus sit amet tempus.`;

const OFFERS = {
  'taxi': [
    {title: `Салон, прокуренный не папиросами, а благородными сигаретами с фильтром`, cost: 10},
    {title: `Есть ремень безопасности`, cost: 10},
    {title: `Трезвый водитель`, cost: 30},
  ],
  'train': [
    {title: `Выбрать место`, cost: 5},
    {title: `Выбрать место не у туалета`, cost: 10},
    {title: `Можно стырить стакан с подставкой из нержавейки`, cost: 10},
  ],
  'ship': [
    {title: `Недырявая лодка`, cost: 10},
    {title: `Второе весло`, cost: 5},
    {title: `Лодка с мотором`, cost: 30},
  ],
  'flight': [
    {title: `Выбрать место`, cost: 10},
    {title: `Выбрать место не у туалета`, cost: 20},
    {title: `Добавить багаж`, cost: 10},
    {title: `Курица или рыба`, cost: 10},
    {title: `Реально курица или рыба, а не только то, что осталось`, cost: 15},
  ],
  'check-in': [
    {title: `Номер без клопов`, cost: 15},
    {title: `Номер совсем без клопов`, cost: 25},
  ],
  'sightseeing': [
    {title: `Провожатый из местных, чтобы не тронули`, cost: 50},
    {title: `Провожатый из авторитетных местных, чтобы точно не тронули`, cost: 100},
  ],
};

const POINT_TYPES = [
  {title: `taxi`, iconSrc: `img/icons/taxi.png`, offers: OFFERS[`taxi`]},
  {title: `bus`, iconSrc: `img/icons/bus.png`},
  {title: `train`, iconSrc: `img/icons/train.png`, offers: OFFERS[`train`]},
  {title: `ship`, iconSrc: `img/icons/ship.png`, offers: OFFERS[`ship`]},
  {title: `transport`, iconSrc: `img/icons/transport.png`},
  {title: `flight`, iconSrc: `img/icons/flight.png`, offers: OFFERS[`flight`]},
  {title: `drive`, iconSrc: `img/icons/drive.png`},
  {title: `check-in`, iconSrc: `img/icons/check-in.png`, offers: OFFERS[`check-in`]},
  {title: `sightseeing`, iconSrc: `img/icons/sightseeing.png`, offers: OFFERS[`sightseeing`]},
  {title: `restaurant`, iconSrc: `img/icons/restaurant.png`},
];

export const generatePictures = () => {
  let pictures = new Array(randomInt(0, 5));

  return pictures.fill(``).map(() => `http://picsum.photos/248/152?r=${randomInt(1, 10)}`);
};

export const generateRandomText = () => {
  let randomSentenses = [];

  for (let i = 0; i < randomInt(1, 5); i++) {
    randomSentenses.push(getRandomArrayElement(MOCK_TEXT.split(`.`)).trim());
  }

  return randomSentenses.join(`. `) + `.`;
};

const DESTINATIONS_NAMES = [
  `Коровино`,
  `Лепёхино`,
  `Дураково`,
  `Верхние Хмыри`,
  `Горелово`,
  `Неелово`,
  `Неурожайка`,
];

const generateDestination = () => {
  return {
    name: getRandomArrayElement(DESTINATIONS_NAMES),
    description: {
      text: generateRandomText(),
      pictures: generatePictures()
    }
  };
};

export const generateDates = () => {
  const maxGap = 30;
  const daysGap = randomInt(-maxGap, maxGap);
  const timeGap = randomInt(1, maxGap);
  const pointDate = dayjs().add(daysGap, `day`).add(randomInt(0, 60), `minute`);
  return ({
    start: pointDate,
    end: pointDate.add(timeGap, `hour`).add(randomInt(0, 60), `minute`)
  });
};

export const generatePoint = () => {
  const dates = generateDates();
  const pointType = getRandomArrayElement(POINT_TYPES);
  const offers = pointType.hasOwnProperty(`offers`) ? pointType.offers.filter(() => Boolean(randomInt(0, 1))) : [];
  const destination = generateDestination();
  const startDate = dates.start;
  const endDate = dates.end;
  const cost = randomInt(50, 250);
  const favorite = Boolean(randomInt(0, 1));
  const termDays = endDate.diff(startDate, `days`);
  const termHours = endDate.diff(startDate, `hours`) - termDays * 24;
  const termMinutes = endDate.diff(startDate, `minutes`) - (termHours + termDays * 24) * 60;
  const duration = [
    termDays ? `${termDays.toString().padStart(2, `0`)}D` : ``,
    (termDays || termHours) ? `${termHours.toString().padStart(2, `0`)}H` : ``,
    `${termMinutes.toString().padStart(2, `0`)}M`
  ]
  .filter((term) => term);

  return {
    dates,
    eventType: pointType.title,
    eventTypeIcon: pointType.iconSrc,
    offers,
    destination,
    startDate,
    endDate,
    cost,
    favorite,
    termDays,
    duration: duration.join(` `)
  };
};
