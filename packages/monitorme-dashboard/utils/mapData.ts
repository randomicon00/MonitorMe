const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch (error) {
    return "-";
  }
};

export const mapDataToTableFields = (item: any, type: string) => {
  return {
    type,
    id: item.id || item.ID,
    createdAt: formatDate(item.createdAt) || formatDate(item.CreatedAt),
    userId: item.userId || "-",
    sessionId: item.sessionId || item.session_id || "-",
  };
};
