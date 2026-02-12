/**
 * Convert a time duration string (e.g., "1s200ms") to microseconds.
 */
const convertDurationStrToUs = (timeString: string): number => {
  const unitToMicroseconds: Record<string, number> = {
    ms: 1000, // milliseconds to microseconds
    s: 1_000_000, // seconds to microseconds
    us: 1, // microseconds
  };

  const matches = timeString.match(/(\d+)\s*(ms|s|us)/g) || [];
  return matches.reduce((total, match) => {
    const [_, value, unit] = match.match(/(\d+)\s*(ms|s|us)/) || [];
    return total + parseInt(value) * (unitToMicroseconds[unit] || 0);
  }, 0);
};

/**
 * Create data for the bar chart from spans.
 */
export const createBarChartData = (spans: any[], label: string) => {
  if (!spans || spans.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Find the earliest `sentAt` to normalize times
  const startTime = Math.min(...spans.map((span) => Number(span.sentAt)));

  // Process spans to calculate relative times and durations
  const processedSpans = spans.map(({ spanId, duration, sentAt }) => {
    const durationUs = convertDurationStrToUs(duration); // Convert duration to microseconds
    const timeSentUs = Number(sentAt); // Ensure `sentAt` is numeric
    const endTimeUs = timeSentUs + durationUs; // Compute end time

    return {
      spanId,
      startTimeMs: Math.ceil((timeSentUs - startTime) / 1000), // Normalize to milliseconds
      endTimeMs: Math.ceil((endTimeUs - startTime) / 1000), // Normalize to milliseconds
    };
  });

  // Build chart labels and datasets
  const labels = processedSpans.map((span: any) => span.spanId);
  const data = processedSpans.map((span: any) => [
    span.startTimeMs,
    span.endTimeMs,
  ]);

  return {
    labels,
    datasets: [
      {
        label,
        data,
        fill: true,
        backgroundColor: [
          "rgba(54, 127, 143, 1)",
          "rgba(73, 173, 175, 1)",
          "rgba(104, 194, 191, 1)",
          "rgba(242, 188, 70, 1)",
          "rgba(228, 135, 76, 1)",
          "rgba(223, 86, 77, 1)",
          "rgba(243, 224, 181, 1)",
          "rgba(39, 29, 63, 1)",
        ],
        skipNull: true,
      },
    ],
  };
};
