export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date(); // Create a dummy date object
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // This ensures AM/PM
  });
};


export const formatDate = (dateString) => {
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-IN", options);
};
