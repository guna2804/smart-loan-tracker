import { Loader2 } from "lucide-react";
import { useGlobalLoader } from "../../contexts/GlobalLoaderContext";

export default function GlobalLoader() {
  const { isLoading, loadingMessage } = useGlobalLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center w-screen h-screen bg-white/20 backdrop-blur-lg border border-white/20 shadow-lg">
      <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-4" />
      <p className="text-lg font-medium text-gray-700">{loadingMessage}</p>
    </div>
  );
}
