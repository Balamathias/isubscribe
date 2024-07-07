// hooks/useScreenshot.ts
import { useRef } from 'react';
import html2canvas from 'html2canvas';

const useScreenshot = () => {
  const ref = useRef<HTMLDivElement>(null);

  const takeScreenshot = async () => {
    if (ref.current) {
      const canvas = await html2canvas(ref.current);
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'isubscribe_receipt.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return { ref, takeScreenshot };
};

export default useScreenshot;
