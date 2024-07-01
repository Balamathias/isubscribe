import { Loader } from "lucide-react";

const LoadingSpinner = ({ isPending=true }: { isPending?: boolean }) => {
  if (!isPending) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center pointer-events-auto cursor-wait">
      <div className=" bg-white p-2 rounded-full shadow-inner">
        <Loader className="w-9 h-9 animate-spin text-violet-600" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
