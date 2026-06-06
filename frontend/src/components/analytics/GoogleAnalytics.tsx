import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

const GA_MEASUREMENT_ID_PREFIX = "G-";

function isGaMeasurementId(value: string | undefined): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();

  return (
    trimmedValue.startsWith(GA_MEASUREMENT_ID_PREFIX) &&
    trimmedValue.length > GA_MEASUREMENT_ID_PREFIX.length
  );
}

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  if (!isGaMeasurementId(measurementId)) {
    return null;
  }

  return <NextGoogleAnalytics gaId={measurementId.trim()} />;
}