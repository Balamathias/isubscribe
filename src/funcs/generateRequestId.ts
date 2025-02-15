export default function generateRequestId(): string {
    const date = new Date();
    date.toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    const dateTimeString = `${year}${month}${day}${hours}${minutes}`;
  
    const randomString = Math.random().toString(36).substring(2, 14); 
  
    const requestId = `${dateTimeString}${randomString}`;
  
    return requestId;
  }
  
  