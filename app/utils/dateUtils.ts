import { format, isToday, isYesterday, isTomorrow } from 'date-fns';

/**
 * Formats a date in a human-readable way
 * If the date is today, shows "Today"
 * If the date is yesterday, shows "Yesterday"
 * If the date is tomorrow, shows "Tomorrow"
 * Otherwise, shows the date in the format "MMM d, yyyy"
 */
export function formatDate(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  
  return format(date, 'MMM d, yyyy');
}

/**
 * Formats a date with time in a human-readable way
 */
export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const timeStr = format(date, 'h:mm a');
  return `${dateStr} at ${timeStr}`;
}

/**
 * Returns a relative time string (e.g., "2 hours ago" or "in 3 days")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  
  if (diffInSeconds < 0) {
    // Past
    const seconds = Math.abs(diffInSeconds);
    
    if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    if (isYesterday(date)) return 'Yesterday';
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  } else {
    // Future
    const seconds = diffInSeconds;
    
    if (seconds < 60) return `in ${seconds} second${seconds !== 1 ? 's' : ''}`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
    
    if (isTomorrow(date)) return 'Tomorrow';
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `in ${days} day${days !== 1 ? 's' : ''}`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `in ${months} month${months !== 1 ? 's' : ''}`;
    
    const years = Math.floor(months / 12);
    return `in ${years} year${years !== 1 ? 's' : ''}`;
  }
} 