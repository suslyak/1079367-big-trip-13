import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

import {generateDestinations} from './destinations.js';
import {randomInt, getRandomArrayElement} from '../utils/common.js';

export const OFFERS = {
  'taxi': [
    {id: 1, name: `taxi`, title: `Салон, прокуренный не папиросами, а благородными сигаретами с фильтром`, cost: 10},
    {id: 2, name: `taxi`, title: `Есть ремень безопасности`, cost: 10},
    {id: 3, name: `taxi`, title: `Трезвый водитель`, cost: 30},
  ],
  'train': [
    {id: 1, name: `train`, title: `Выбрать место`, cost: 5},
    {id: 2, name: `train`, title: `Выбрать место не у туалета`, cost: 10},
    {id: 3, name: `train`, title: `Можно стырить стакан с подставкой из нержавейки`, cost: 10},
  ],
  'ship': [
    {id: 1, name: `ship`, title: `Недырявая лодка`, cost: 10},
    {id: 2, name: `ship`, title: `Второе весло`, cost: 5},
    {id: 3, name: `ship`, title: `Лодка с мотором`, cost: 30},
  ],
  'flight': [
    {id: 1, name: `flight`, title: `Выбрать место`, cost: 10},
    {id: 2, name: `flight`, title: `Выбрать место не у туалета`, cost: 20},
    {id: 3, name: `flight`, title: `Добавить багаж`, cost: 10},
    {id: 4, name: `flight`, title: `Курица или рыба`, cost: 10},
    {id: 5, name: `flight`, title: `Реально курица или рыба, а не только то, что осталось`, cost: 15},
  ],
  'check-in': [
    {id: 1, name: `check-in`, title: `Номер без клопов`, cost: 15},
    {id: 2, name: `check-in`, title: `Номер совсем без клопов`, cost: 25},
  ],
  'sightseeing': [
    {id: 1, name: `sightseeing`, title: `Провожатый из местных, чтобы не тронули`, cost: 50},
    {id: 2, name: `sightseeing`, title: `Провожатый из авторитетных местных, чтобы точно не тронули`, cost: 100},
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

export const DESTINATIONS = generateDestinations();

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
  const selectedOffers = (pointType in OFFERS) ? OFFERS[pointType].filter(() => Boolean(randomInt(0, 1))) : [];
  const destination = getRandomArrayElement(DESTINATIONS);
  const cost = randomInt(50, 250);
  const favorite = Boolean(randomInt(0, 1));

  return {
    id: nanoid(8),
    pointType,
    selectedOffers,
    destination,
    start,
    end,
    cost,
    favorite,
  };
};
