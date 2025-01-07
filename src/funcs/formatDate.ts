export const formatDate = (date: string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Africa/Lagos',
    }).format(d);
  };
  
  export const formatDateTime = (date: string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Africa/Lagos',
    }).format(d);
  };
  
  export const formatTimestamp = (date: string) => {
    const d = new Date(date);
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Lagos',
    });
    return formatter.format(d);
  };
  