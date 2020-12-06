// from you dont need lodash underscore
export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (arr) => arr[randomInt(0, arr.length - 1)];

const DESTINATIONS_NAMES = [
  `Коровино`,
  `Лепёхино`,
  `Дураково`,
  `Верхние Хмыри`,
  `Горелово`,
  `Неелово`,
  `Неурожайка`,
];

const MOCK_TEXT = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.\
  Cras aliquet varius magna, non porta ligula feugiat eget.\
  Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.\
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris,\
  condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus,\
  purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit\
  in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.\
  In rutrum ac purus sit amet tempus.`;

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

export const generateDestinations = () => {
  let destinations = [];

  for (const name of DESTINATIONS_NAMES) {
    destinations.push({
      name,
      description: {
        text: generateRandomText(),
        pictures: generatePictures()
      }
    });
  }

  return destinations;
};
