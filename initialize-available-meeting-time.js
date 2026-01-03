//Taking the contact owner's availability, returns 3 available slots for an hour-long meeting, taking into consideration business hours (9am to 5pm) and excluding weekends

//Clean up busyTimes from contact owner's calendar
const busyTimes = [];
for (const item of $input.all()) {
  let start = DateTime.fromISO(item.json.start.dateTime);
  let end = DateTime.fromISO(item.json.end.dateTime);
  let timezone = item.json.start.timeZone;
  busyTimes.push({
    start: start,
    end: end,
    timezone: timezone,
  });
}

//Rounds the time to the nearest 30-minute or 60-minute interval
function roundUpToNearestIntervalLocal(date) {
  const minutes = date.minute;
  const next30 = minutes + (30 - (minutes % 30));
  const next60 = minutes + (60 - (minutes % 60));

  const diff30 = Math.abs(next30 - minutes);
  const diff60 = Math.abs(next60 - minutes);

  const rounded = diff30 < diff60 ? next30 : next60;

  return date.set({ minute: rounded, second: 0, millisecond: 0 });
}

//Ensures at least 1 hour gap between now and the start time
function ensureMinimumGap(date) {
  const now = DateTime.local();
  const minGap = 60; //Minimum gap in minutes (1 hour)

  if (date.diff(now, 'minutes').minutes < minGap) {
    date = date.plus({ minutes: minGap });
  }

  return date;
}

//Clamps the time to business hours (9am–5pm) and excludes weekends
function clampToBusinessHours(date) {
  const dayOfWeek = date.weekday; //1 = Monday, 7 = Sunday

  if (dayOfWeek === 6) { //Saturday
    date = date.plus({ days: 2 }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  } else if (dayOfWeek === 7) { //Sunday
    date = date.plus({ days: 1 }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  } else if (date.hour < 9) { //Before 9 AM
    date = date.set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  } else if (date.hour >= 17) { //After 5 PM
    date = date.plus({ days: 1 }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  }

  return date;
}

//Adds 1 hour to the meeting time to calculate meeting end time
function addOneHour(date) {
  return date.plus({ hours: 1 });
}

//Finds the next available time slot excluding busy times
function findNextAvailableSlot(busyTimes, startTime) {
  let currentTime = startTime;

  //Sorts the busy times by start time
  busyTimes.sort((a, b) => a.start - b.start);

  //Iterates through busy times and check for available gaps
  for (let i = 0; i < busyTimes.length; i++) {
    const busyStart = busyTimes[i].start;
    const busyEnd = busyTimes[i].end;

    //If the current time is before a busy time and there is a gap
    if (currentTime < busyStart) {
      const gap = busyStart.diff(currentTime, 'minutes').minutes;

      //If the gap is larger than 60 minutes, we found an available slot
      if (gap >= 60) {
        const slotStart = currentTime;
        const slotEnd = slotStart.plus({ minutes: 60 });

        return { start: slotStart, end: slotEnd };
      }
    }

    //If the current time is after a busy period, move past it
    if (currentTime < busyEnd) {
      currentTime = busyEnd;
    }
  }

  //If there are no gaps, return null
  return null;
}

//Main logic to get 3 available meeting time slots
function getNextAvailableSlots(busyTimes) {
  const availableSlots = [];
  let currentDate = DateTime.local();

  //Loop to find the next 3 available slots over the next few days
  while (availableSlots.length < 3) {
    let roundedLocal = roundUpToNearestIntervalLocal(currentDate);
    let minimumGapTime = ensureMinimumGap(roundedLocal);
    let clampedTime = clampToBusinessHours(minimumGapTime);

    //Find the next available slot on this day
    const availableSlot = findNextAvailableSlot(busyTimes, clampedTime);

    //If a slot is found, add it to the available slots list
    if (availableSlot) {
      //Add 1 hour to the start time
      const plusOneHour = addOneHour(availableSlot.start);
      availableSlots.push({
        startTime: availableSlot.start.toISO(),
        endTime: plusOneHour.toISO(),
      });

      //Move to the next day after the found slot
      currentDate = availableSlot.end.plus({ days: 1 }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
    } else {
      //If no available slot was found, move to the next day
      currentDate = currentDate.plus({ days: 1 }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
    }

    //If there are no gaps in the next 2 weeks, break
    if (currentDate.diff(DateTime.local().plus({ weeks: 2 }), 'days').days >= 0) {
      break;
    }
  }

  return availableSlots.length ? availableSlots : [{ startTime: "None found", endTime: "None found" }];
}

//Get the next 3 available slots
const nextAvailableSlots = getNextAvailableSlots(busyTimes);

//Format the available slots into a readable email-friendly format
function formatSlotsForEmail(slots) {
  if (slots[0].startTime === "None found") {
    return "Unfortunately, no available slots were found in the next two weeks.";
  }

  let emailBody = "Here are my next available meeting times:<br>";

  slots.forEach((slot) => {
    emailBody += `Start: ${DateTime.fromISO(slot.startTime).toLocaleString(DateTime.DATETIME_MED)}<br>`;
    emailBody += `End: ${DateTime.fromISO(slot.endTime).toLocaleString(DateTime.DATETIME_MED)}<br><br>`;
  });

  return emailBody;
}

//Generate the email body
const emailBody = formatSlotsForEmail(nextAvailableSlots);

//Output the formatted email body
console.log(emailBody);

return {"availableSlots": emailBody};
