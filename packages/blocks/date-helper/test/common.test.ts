import {
  ChangeDateFormat,
  createNewDate,
  getDateInformation,
  timeFormat,
} from '../src/lib/common/index';

const formatsWithTime = [
  timeFormat.format00,
  timeFormat.format01,
  timeFormat.format02,
  timeFormat.format05,
  timeFormat.format06,
  timeFormat.format14,
];

describe('createNewDate', () => {
  for (const targetFormat of Object.values(timeFormat)) {
    test(`should format current date to ${targetFormat}`, () => {
      const originalDate = new Date();
      const formattedDate = createNewDate(originalDate, targetFormat);
      const dateInfo = getDateInformation(formattedDate, targetFormat);

      expect(dateInfo).not.toBeNull();
      expect(dateInfo.year).toBe(originalDate.getFullYear());
      expect(dateInfo.month).toBe(originalDate.getMonth() + 1);
      expect(dateInfo.day).toBe(originalDate.getDate());
    });
  }

  for (const format of formatsWithTime) {
    const targetFormat = Object.values(timeFormat).find(
      (key) => key === format,
    )!;

    test(`should include time information when format is ${targetFormat}`, () => {
      const originalDate = new Date();
      const formattedDate = createNewDate(originalDate, targetFormat);
      const dateInfo = getDateInformation(formattedDate, targetFormat);

      expect(dateInfo.hour).toBe(originalDate.getHours());
      expect(dateInfo.minute).toBe(originalDate.getMinutes());
      expect(dateInfo.second).toBe(originalDate.getSeconds());

      if (targetFormat === timeFormat.format14) {
        expect(dateInfo.unix_time).toBe(originalDate.getTime());
      } else {
        const originalTimeWithoutMiliseconds =
          originalDate.getTime() - (originalDate.getTime() % 1000);
        expect(dateInfo.unix_time).toBe(originalTimeWithoutMiliseconds);
      }
    });
  }
});

describe('ChangeDateFormat', () => {
  for (const sourceFormat of Object.values(timeFormat)) {
    for (const targetFormat of Object.values(timeFormat)) {
      test(`should convert date from ${sourceFormat} to ${targetFormat}`, () => {
        const originalDate = new Date();
        const dateInSourceFormat = createNewDate(originalDate, sourceFormat);
        const dateInTargetFormat = ChangeDateFormat(
          dateInSourceFormat,
          sourceFormat,
          'UTC',
          targetFormat,
          'UTC',
        );
        const dateInfo = getDateInformation(dateInTargetFormat, targetFormat);

        expect(dateInfo).not.toBeNull();
        expect(dateInfo.year).toBe(originalDate.getFullYear());
        expect(dateInfo.month).toBe(originalDate.getMonth() + 1);
        expect(dateInfo.day).toBe(originalDate.getDate());
      });
    }
  }

  for (const sourceF of formatsWithTime) {
    for (const targetF of formatsWithTime) {
      const sourceFormat = Object.values(timeFormat).find(
        (key) => key === sourceF,
      )!;
      const targetFormat = Object.values(timeFormat).find(
        (key) => key === targetF,
      )!;

      test(`should include exact time information when source format is ${sourceFormat} and target format is ${targetFormat}`, () => {
        const originalDate = new Date();
        const dateInSourceFormat = createNewDate(originalDate, sourceFormat);
        const dateInTargetFormat = ChangeDateFormat(
          dateInSourceFormat,
          sourceFormat,
          'UTC',
          targetFormat,
          'UTC',
        );
        const dateInfo = getDateInformation(dateInTargetFormat, targetFormat);

        expect(dateInfo.hour).toBe(originalDate.getHours());
        expect(dateInfo.minute).toBe(originalDate.getMinutes());
        expect(dateInfo.second).toBe(originalDate.getSeconds());

        if (
          sourceFormat === timeFormat.format14 &&
          targetFormat === timeFormat.format14
        ) {
          expect(dateInfo.unix_time).toBe(originalDate.getTime());
        } else {
          const originalTimeWithoutMiliseconds =
            originalDate.getTime() - (originalDate.getTime() % 1000);
          expect(dateInfo.unix_time).toBe(originalTimeWithoutMiliseconds);
        }
      });
    }
  }
});
