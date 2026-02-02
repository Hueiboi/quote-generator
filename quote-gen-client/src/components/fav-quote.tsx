import type { BaseQuote } from "../types/quote";

interface FavListProps {
  favourites: BaseQuote[];
  onDelete: (id: number) => Promise<void>;
}

export const FavList: React.FC<FavListProps> = ({ favourites, onDelete }) => {
  if (favourites.length === 0)
    return (
      <p className="text-zinc-500 dark:text-zinc-400 italic mt-4 text-center">
        Chưa có quote yêu thích
      </p>
    );

  // Hàm helper để format ngày tháng
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        📚 Bộ sưu tập của bạn 
        <span className="text-sm font-normal text-zinc-500">({favourites.length})</span>
      </h3>
      
      {/* Cái hộp fix chiều cao và có scroll */}
      <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-inner">
        <div className="h-[400px] overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {favourites.map((fav) => (
              <div
                key={fav.id}
                className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm md:text-base text-zinc-800 dark:text-zinc-200 italic leading-relaxed">
                      "{fav.quote}"
                    </p>
                    
                    <div className="flex gap-3 mt-2 items-center">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] rounded-full uppercase font-bold">
                        {fav.category}
                      </span>
                      {fav.created_at && (
                        <span className="text-[10px] text-zinc-400">
                          ⏱ {formatDate(fav.created_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => fav.id && onDelete(fav.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all p-1"
                    title="Xóa khỏi yêu thích"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};