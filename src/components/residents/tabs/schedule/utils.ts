
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'medical': return 'bg-red-100 text-red-800';
    case 'therapy': return 'bg-blue-100 text-blue-800';
    case 'social': return 'bg-green-100 text-green-800';
    case 'hygiene': return 'bg-purple-100 text-purple-800';
    case 'meal': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getEventTypeLabel = (eventType: string) => {
  const labels = {
    medical: 'Medizinisch',
    therapy: 'Therapie',
    social: 'Sozial',
    hygiene: 'Hygiene',
    meal: 'Mahlzeit',
    rest: 'Ruhe',
    custom: 'Sonstige'
  };
  return labels[eventType as keyof typeof labels] || eventType;
};

export const getRecurringLabel = (recurring: string) => {
  switch (recurring) {
    case 'daily': return 'Täglich';
    case 'weekly': return 'Wöchentlich';
    case 'monthly': return 'Monatlich';
    default: return 'Einmalig';
  }
};

export const formatTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDate = (dateTime: string) => {
  return format(new Date(dateTime), 'EEEE, d. MMMM yyyy', { locale: de });
};
