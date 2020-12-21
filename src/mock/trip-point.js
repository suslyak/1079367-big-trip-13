import dayjs from 'dayjs';
import {generateDestinations} from './destinations.js';

import {randomInt, getRandomArrayElement} from '../utils/common.js';

export const OFFERS = {
  'taxi': [
    {name: `taxi`, title: `Салон, прокуренный не папиросами, а благородными сигаретами с фильтром`, cost: 10},
    {name: `taxi`, title: `Есть ремень безопасности`, cost: 10},
    {name: `taxi`, title: `Трезвый водитель`, cost: 30},
  ],
  'train': [
    {name: `train`, title: `Выбрать место`, cost: 5},
    {name: `train`, title: `Выбрать место не у туалета`, cost: 10},
    {name: `train`, title: `Можно стырить стакан с подставкой из нержавейки`, cost: 10},
  ],
  'ship': [
    {name: `ship`, title: `Недырявая лодка`, cost: 10},
    {name: `ship`, title: `Второе весло`, cost: 5},
    {name: `ship`, title: `Лодка с мотором`, cost: 30},
  ],
  'flight': [
    {name: `flight`, title: `Выбрать место`, cost: 10},
    {name: `flight`, title: `Выбрать место не у туалета`, cost: 20},
    {name: `flight`, title: `Добавить багаж`, cost: 10},
    {name: `flight`, title: `Курица или рыба`, cost: 10},
    {name: `flight`, title: `Реально курица или рыба, а не только то, что осталось`, cost: 15},
  ],
  'check-in': [
    {name: `check-in`, title: `Номер без клопов`, cost: 15},
    {name: `check-in`, title: `Номер совсем без клопов`, cost: 25},
  ],
  'sightseeing': [
    {name: `sightseeing`, title: `Провожатый из местных, чтобы не тронули`, cost: 50},
    {name: `sightseeing`, title: `Провожатый из авторитетных местных, чтобы точно не тронули`, cost: 100},
  ],
};

export const POINT_TYPES = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `flight`,
  `drive`,
  `check-in`,
  `sightseeing`,
  `restaurant`,
];

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
  const {start, end} = generateDates();
  const pointType = getRandomArrayElement(POINT_TYPES);
  const offers = (pointType in OFFERS) ? OFFERS[pointType].filter(() => Boolean(randomInt(0, 1))) : [];
  const destination = getRandomArrayElement(generateDestinations());
  const cost = randomInt(50, 250);
  const favorite = Boolean(randomInt(0, 1));

  return {
    pointType,
    offers,
    destination,
    start,
    end,
    cost,
    favorite,
  };
};
