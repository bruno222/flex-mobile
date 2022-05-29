import { useMemo } from 'react';
import { format, LocaleFunc, register } from 'timeago.js';

const localeFunc = (number: number, index: number, totalSec: number) => {
  // number: the timeago / timein number;
  // index: the index of array below;
  // totalSec: total seconds between date to be formatted and today's date;
  return [
    ['just now', 'right now'],
    ['%s secs ago', 'in %s seconds'],
    ['1 min ago', 'in 1 minute'],
    ['%s mins ago', 'in %s minutes'],
    ['1 hr ago', 'in 1 hour'],
    ['%s hrs ago', 'in %s hours'],
    ['1 day ago', 'in 1 day'],
    ['%s days ago', 'in %s days'],
    ['1 week ago', 'in 1 week'],
    ['%s weeks ago', 'in %s weeks'],
    ['1 month ago', 'in 1 month'],
    ['%s months ago', 'in %s months'],
    ['1 year ago', 'in 1 year'],
    ['%s years ago', 'in %s years'],
  ][index] as any;
};

// register your locale with timeago
const short = 'short';
register(short, localeFunc as any);

export const timeAgo = (age: number) => format(Date.now() - age, short);
