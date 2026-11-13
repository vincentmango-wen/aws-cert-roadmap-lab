export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

let developmentDate: string | undefined;

export function getUpdatesBuildDate(): string {
  const captured = process.env.UPDATES_BUILD_DATE;
  if (captured !== undefined) {
    if (!isCalendarDate(captured)) throw new Error("Invalid UPDATES_BUILD_DATE");
    return captured;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Production requires UPDATES_BUILD_DATE from the build wrapper");
  }
  if (!developmentDate) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date());
    const part = (type: string) => parts.find((entry) => entry.type === type)!.value;
    developmentDate = `${part("year")}-${part("month")}-${part("day")}`;
  }
  return developmentDate;
}
