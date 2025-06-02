
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 4 && hour < 11) {
    return "Guten Morgen";
  } else if (hour >= 11 && hour < 18) {
    return "Guten Tag";
  } else {
    return "Guten Abend";
  }
}

export function getPersonalizedGreeting(userName?: string): string {
  const timeGreeting = getTimeBasedGreeting();
  return userName ? `${timeGreeting}, ${userName}!` : `${timeGreeting}!`;
}
