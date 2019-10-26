import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  YEARS,
  MONTHS,
  DAYS,
  HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  MICROSECONDS,
  NANOSECONDS,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';
import { duration as STRING } from './regex.mjs';

export class Duration {
  constructor(
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
    microseconds = 0,
    nanoseconds = 0,
    disambiguation = 'balance'
  ) {
    switch (disambiguation) {
      case 'constrain':
        years = ES.ConstrainToRange(years, 0, Number.MAX_SAFE_INTEGER);
        months = ES.ConstrainToRange(months, 0, Number.MAX_SAFE_INTEGER);
        days = ES.ConstrainToRange(days, 0, Number.MAX_SAFE_INTEGER);
        hours = ES.ConstrainToRange(hours, 0, Number.MAX_SAFE_INTEGER);
        minutes = ES.ConstrainToRange(minutes, 0, Number.MAX_SAFE_INTEGER);
        seconds = ES.ConstrainToRange(seconds, 0, Number.MAX_SAFE_INTEGER);
        milliseconds = ES.ConstrainToRange(milliseconds, 0, Number.MAX_SAFE_INTEGER);
        microseconds = ES.ConstrainToRange(microseconds, 0, Number.MAX_SAFE_INTEGER);
        nanoseconds = ES.ConstrainToRange(nanoseconds, 0, Number.MAX_SAFE_INTEGER);
        break;
      case 'balance':
        let tdays;
        ({
          days: tdays,
          hour: hours,
          minute: minutes,
          second: seconds,
          millisecond: milliseconds,
          microsecond: microseconds,
          nanosecond: nanoseconds
        } = ES.BalanceTime(
          ES.ConstrainToRange(ES.ToInteger(hours), 0, Number.MAX_SAFE_INTEGER),
          ES.ConstrainToRange(ES.ToInteger(minutes), 0, Number.MAX_SAFE_INTEGER),
          ES.ConstrainToRange(ES.ToInteger(seconds), 0, Number.MAX_SAFE_INTEGER),
          ES.ConstrainToRange(ES.ToInteger(milliseconds), 0, Number.MAX_SAFE_INTEGER),
          ES.ConstrainToRange(ES.ToInteger(microseconds), 0, Number.MAX_SAFE_INTEGER),
          ES.ConstrainToRange(ES.ToInteger(nanoseconds), 0, Number.MAX_SAFE_INTEGER)
        ));
        days += tdays;
        days = ES.ConstrainToRange(ES.ToInteger(days), 0, Number.MAX_SAFE_INTEGER);
        years = ES.ConstrainToRange(ES.ToInteger(years), 0, Number.MAX_SAFE_INTEGER);
        break;
    }

    years = ES.AssertPositiveInteger(years);
    months = ES.AssertPositiveInteger(months);
    days = ES.AssertPositiveInteger(days);
    hours = ES.AssertPositiveInteger(hours);
    minutes = ES.AssertPositiveInteger(minutes);
    seconds = ES.AssertPositiveInteger(seconds);
    milliseconds = ES.AssertPositiveInteger(milliseconds);
    microseconds = ES.AssertPositiveInteger(microseconds);
    nanoseconds = ES.AssertPositiveInteger(nanoseconds);

    CreateSlots(this);
    SetSlot(this, YEARS, years);
    SetSlot(this, MONTHS, months);
    SetSlot(this, DAYS, days);
    SetSlot(this, HOURS, hours);
    SetSlot(this, MINUTES, minutes);
    SetSlot(this, SECONDS, seconds);
    SetSlot(this, MILLISECONDS, milliseconds);
    SetSlot(this, MICROSECONDS, microseconds);
    SetSlot(this, NANOSECONDS, nanoseconds);
  }
  get years() {
    return GetSlot(this, YEARS);
  }
  get months() {
    return GetSlot(this, MONTHS);
  }
  get days() {
    return GetSlot(this, DAYS);
  }
  get hours() {
    return GetSlot(this, HOURS);
  }
  get minutes() {
    return GetSlot(this, MINUTES);
  }
  get seconds() {
    return GetSlot(this, SECONDS);
  }
  get milliseconds() {
    return GetSlot(this, MILLISECONDS);
  }
  get microseconds() {
    return GetSlot(this, MICROSECONDS);
  }
  get nanoseconds() {
    return GetSlot(this, NANOSECONDS);
  }
  toString() {
    const dateParts = [];
    if (GetSlot(this, YEARS)) dateParts.push(`${GetSlot(this, YEARS)}Y`);
    if (GetSlot(this, MONTHS)) dateParts.push(`${GetSlot(this, MONTHS)}M`);
    if (GetSlot(this, DAYS)) dateParts.push(`${GetSlot(this, DAYS)}D`);

    const timeParts = [];
    if (GetSlot(this, HOURS)) timeParts.push(`${GetSlot(this, HOURS)}H`);
    if (GetSlot(this, MINUTES)) timeParts.push(`${GetSlot(this, MINUTES)}M`);

    const secondParts = [];
    if (GetSlot(this, NANOSECONDS)) secondParts.unshift(`000${GetSlot(this, NANOSECONDS)}`.slice(-3));
    if (GetSlot(this, MICROSECONDS) || secondParts.length)
      secondParts.unshift(`000${GetSlot(this, MICROSECONDS)}`.slice(-3));
    if (GetSlot(this, MILLISECONDS) || secondParts.length)
      secondParts.unshift(`000${GetSlot(this, MILLISECONDS)}`.slice(-3));
    if (secondParts.length) secondParts.unshift('.');
    if (GetSlot(this, SECONDS) || secondParts.length) secondParts.unshift(`${this.seconds}`);
    if (secondParts.length) timeParts.push(`${secondParts.join('')}S`);
    if (timeParts.length) timeParts.unshift('T');
    if (!dateParts.length && !timeParts.length) return 'PT0S';
    return `P${dateParts.join('')}${timeParts.join('')}`;
  }
  static fromString(isoString) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid duration: ${isoString}`);
    const years = ES.ToInteger(match[1]);
    const months = ES.ToInteger(match[2]);
    const days = ES.ToInteger(match[3]);
    const hours = ES.ToInteger(match[4]);
    const minutes = ES.ToInteger(match[5]);
    const seconds = ES.ToInteger(match[6]);
    const milliseconds = ES.ToInteger(match[7]);
    const microseconds = ES.ToInteger(match[8]);
    const nanoseconds = ES.ToInteger(match[9]);
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      'reject'
    );
  }
  static from(...args) {
    return ES.CastDuration(...args);
  }
}
Duration.prototype.toJSON = Duration.prototype.toString;
if ('undefined' !== typeof Symbol) {
  Object.defineProperty(Duration.prototype, Symbol.toStringTag, {
    value: 'Temporal.Duration'
  });
}
MakeIntrinsicClass(Duration);