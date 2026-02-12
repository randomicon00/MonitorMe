// FIXME: Improve the type
type Event = Record<string, any>;

const mapSnapshotToGrid = (event: Event) => {
  return {
    id: event.data.timestamp,
    eventType: "Full DOM snapshot",
    data: JSON.stringify(event.data),
  };
};

export default mapSnapshotToGrid;
