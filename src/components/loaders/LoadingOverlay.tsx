import { cn } from "@/lib/utils";
import { Loader, Loader2 } from "lucide-react";

const LoadingOverlay = ({ isPending=true, loader="1" }: { isPending?: boolean, loader?: "1" | '2' }) => {
  if (!isPending) return null;
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center pointer-events-auto cursor-wait">
       <div className=" bg-white p-2 rounded-full shadow-inner absolute left-4 top-4">
        {
          loader === '1' ? <Loader2 className="w-7 h-7 animate-spin text-violet-600" /> : <Loader className="w-7 h-7 animate-spin text-violet-600" />
        }
      </div>
      <div className={cn(`fixed top-0 left-0 w-full h-[5px]`, {
        'bg-gradient-to-r from-violet-600 via-pink-600 to-fuchsia-600': isPending
      })}></div>
    </div>
  );
};

export default LoadingOverlay;
