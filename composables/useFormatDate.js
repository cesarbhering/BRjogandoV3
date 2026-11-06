/**
 * Formats a match date as day/month and time, following the selected locale
 * (dd/MM HH:mm in Portuguese, MM/dd HH:mm in English), in the visitor's time zone.
 */
export const useFormatDate = () => {
  const { locale } = useI18n();

  const formatDate = (inputDate) => {
    if (!inputDate) return "";
    const date = new Date(inputDate);
    const datePart = date.toLocaleDateString(locale.value, { day: "2-digit", month: "2-digit" });
    const timePart = date.toLocaleTimeString(locale.value, { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${datePart} ${timePart}`;
  };

  return { formatDate };
};
