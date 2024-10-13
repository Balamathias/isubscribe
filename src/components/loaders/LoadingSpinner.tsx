import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const LoadingSpinner = ({ isPending }: { isPending?: boolean }) => {
  if (!isPending) return null;
  return (
    <div className="fixed inset-0  z-[52] flex items-center justify-center pointer-events-auto cursor-wait">
      <div className=" bg-white p-2 rounded-full shadow-inner">
        <Loader className="w-9 h-9 animate-spin text-violet-600" />
      </div>
      <div className={cn(`fixed top-0 left-0 h-[5px] animate-progress bg-gradient-to-r from-violet-600 via-pink-600 to-fuchsia-600 rounded-[2rem]`, {
        'bg-gradient-to-r from-violet-600 via-pink-600 to-fuchsia-600': isPending
      })}></div>
    </div>
  );
};

export default LoadingSpinner;
