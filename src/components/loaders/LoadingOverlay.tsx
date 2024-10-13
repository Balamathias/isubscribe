import { cn } from "@/lib/utils";

const LoadingOverlay = ({ isPending=true, loader="1" }: { isPending?: boolean, loader?: "1" | '2' }) => {
  if (!isPending) return null;
  return (
    <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center pointer-events-auto cursor-wait top-0 left-0 right-0">
      <div className={cn(`fixed top-0 left-0 h-[5px] animate-progress bg-gradient-to-r from-violet-600 via-pink-600 to-fuchsia-600 w-full`, {
        'bg-gradient-to-r from-violet-600 via-pink-600 to-fuchsia-600': isPending
      })}></div>
    </div>
  );
};

export default LoadingOverlay;
