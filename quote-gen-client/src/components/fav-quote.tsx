import type { BaseQuote } from "../types/quote"

interface FavList {
    favourites: BaseQuote[];
    onDelete: (id: number ) => Promise<void>; // Async nhận id
}

export const FavList: React.FC<FavList> = ({favourites, onDelete}) => {
    if(favourites.length === 0) return <p className="text-black-500 dark:text-amber-50 italic mt-4">Chưa có quote yêu thích</p>

    return (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 bg-white">
            {favourites.map((fav) => (
                <div key={fav.id} className="p-4 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl shadow-sm relative group">
                    <p className="text-sm italic mb-2">"{fav.quote}"</p>
                    <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-blue-500 uppercase">{fav.category}</span>
                        <button 
                            onClick={() => onDelete(fav.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}