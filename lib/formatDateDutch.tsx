import { format } from "date-fns";
import { nl } from "date-fns/locale";

export function formatDateDutch(dateString: string) {
  const date = new Date(dateString.slice(0, -1) + "+02:00");
  return format(date, "d MMMM yyyy 'om' HH:mm", { locale: nl });
}
