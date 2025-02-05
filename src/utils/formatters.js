import { get, round, find } from 'lodash-es';
import { format } from 'date-fns';

export const formatFilename = (input, characterLimit = 40) => {
  // minimum character limit is 20, otherwise this will need to be redone
  if (!input) return '';
  const inputLength = input.length;
  if (inputLength < characterLimit) return input;
  const tail = input.substring(inputLength - 10, inputLength);
  const head = input.substring(0, characterLimit - 14);
  return `${head}...${tail}`;
};

export const formatDate = (input, fancy) => {
  const formatter = fancy ? 'PP' : 'yyyy-MM-dd HH:mm';
  try {
    const jsDate =
      typeof input === 'string' ? new Date(input) : input;
    const formattedDate = format(jsDate, formatter);
    return formattedDate;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const elapsedTimeCache = {};
export const getElapsedTimeInWords = (
  durationInSeconds,
  precision = 1,
) => {
  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 60 * 60;
  const SECONDS_PER_DAY = 3600 * 24;

  if (elapsedTimeCache[durationInSeconds])
    return elapsedTimeCache[durationInSeconds];

  let result;
  if (durationInSeconds < SECONDS_PER_MINUTE) {
    result = { value: durationInSeconds, unit: 'second' };
  } else if (
    durationInSeconds >= SECONDS_PER_MINUTE &&
    durationInSeconds < SECONDS_PER_HOUR
  ) {
    result = {
      value: round(durationInSeconds / SECONDS_PER_MINUTE, precision),
      unit: 'minute',
    };
  } else if (
    durationInSeconds >= SECONDS_PER_HOUR &&
    durationInSeconds < SECONDS_PER_DAY
  ) {
    result = {
      value: round(durationInSeconds / SECONDS_PER_HOUR, precision),
      unit: 'hour',
    };
  } else {
    result = {
      value: round(durationInSeconds / SECONDS_PER_DAY, precision),
      unit: 'day',
    };
  }

  elapsedTimeCache[durationInSeconds] = result;
  return result;
};

const possibleErrorPaths = [
  'response.data.message',
  'response.data.message.details',
  'data.message',
  'data.message.details',
];

export const formatError = error => {
  /* You can also throw the server response from a failed Houston
   * request at this thing. */
  const possibleServerErrors = possibleErrorPaths.map(p =>
    get(error, p),
  );
  const serverError = find(possibleServerErrors, e => e);
  const stringError = error instanceof Error && error.toString();
  const errorToPrint = serverError || stringError || error;
  return JSON.stringify(errorToPrint, null, 2);
};
