import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center w-screen h-screen bg-white/40 backdrop-blur-lg border border-white/30 shadow-lg">
      <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
    </div>
  );
}
