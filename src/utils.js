import dayjs from 'dayjs';
import { FilterType } from './const';

function getRandomElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInteger(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function timeDurationDays(start, end) {
  return dayjs(end).diff(start, 'day');
}

function timeDurationHours(start, end) {
  return dayjs(end).diff(start, 'hour') % 24;
}

function timeDurationMinutes(start, end) {
  return dayjs(end).diff(start, 'minute') % 60;
}

function isEventFuture(dueDate) {
  return dueDate.dateStart && dayjs().isBefore(dueDate.dateStart, 'D');
}

function isEventPresent(dueDate) {
  return dueDate.dateStart && dueDate.dateEnd && dayjs(dueDate.dateStart).isSame(dayjs(), 'D');
}

function isEventPast(dueDate) {
  return dueDate.dateEnd && dayjs().isAfter(dueDate.dateEnd, 'D');
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.date)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event.date)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.date)),
};

function sortPointDay(points) {
  return points.sort((firstPoint, secondPoint) => new Date(firstPoint.date.dateStart) - new Date(secondPoint.date.dateStart));
}

function sortPointTime(points) {
  return points.sort((firstPoint, secondPoint) =>
    dayjs(firstPoint.date.dateStart).diff(dayjs(firstPoint.date.dateEnd), 'minutes') -
    dayjs(secondPoint.date.dateStart).diff(dayjs(secondPoint.date.dateEnd), 'minutes'));
}

function sortPointPrice(points) {
  return points.sort((firstPoint, secondPoint) => secondPoint.price - firstPoint.price);
}

export { getRandomElement,
  getRandomInteger,
  timeDurationHours,
  timeDurationMinutes,
  timeDurationDays,
  isEventFuture,
  isEventPresent,
  isEventPast,
  filter,
  updateItem,
  sortPointDay,
  sortPointTime,
  sortPointPrice
};
