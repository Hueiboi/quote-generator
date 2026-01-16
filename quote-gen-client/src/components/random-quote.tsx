import { useEffect, useState, useCallback } from "react";
// import { quotes } from "../data/quotes";
import type { Quote } from "../types/quote";
import { CopyButton } from "./copy-btn";

export default function RandomQuote() {
    const [quote, setQuote] = useState<Quote>({text: "Press the button below to get your quote", author: "System"});
    const [loading, setLoading] = useState<boolean>(false);
    const [isSpamming, setIsSpamming] = useState<boolean>(false);
    const [countDown, setCountDown] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState<'love' | 'health'| 'life' | 'career'>('life');

    const [isDark, setIsDark] = useState(false);

    // Sử dụng useCallback để memoize function và tránh re-render không cần thiết
    const getAIQuote = useCallback(async () => {
        // Lấy token từ localStorage (đã được lưu khi đăng nhập)
        const token = localStorage.getItem('token');

        // Kiểm tra token có tồn tại không
        if (!token) {
            setQuote({text: "Vui lòng đăng nhập để sử dụng tính năng này", author: "System"});
            return;
        }

        setLoading(true);
        try {
            // Gửi request đến API generate quote với token trong header
            const res = await fetch("http://localhost:5000/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}` // Format: "Bearer <token>"
                },
                body: JSON.stringify({category: selectedCategory})
            });

            // Xử lý lỗi rate limit (429 - quá nhiều request)
            if (res.status === 429) {
                const errorData = await res.json();
                console.log(errorData);
                setIsSpamming(true);
                setCountDown(10);
                return;
            }

            // Xử lý lỗi 403 - Token không hợp lệ hoặc hết hạn
            if (res.status === 403) {
                const errorData = await res.json();
                setQuote({text: errorData.message || "Token không hợp lệ. Vui lòng đăng nhập lại", author: "System"});
                // Có thể tự động logout hoặc redirect về trang login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                return;
            }

            // Xử lý lỗi 401 - Chưa đăng nhập
            if (res.status === 401) {
                const errorData = await res.json();
                setQuote({text: errorData.message || "Vui lòng đăng nhập", author: "System"});
                return;
            }

            // Nếu response không ok, throw error
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            // Parse dữ liệu từ response thành công
            const data = await res.json();
            setQuote(
                {
                    text: data.content,
                    author: data.author || "-"
                }
            )
        } 
        catch (error) {
            console.error("Error: ", error);
            setQuote({text: "Không thể tạo quote. Vui lòng thử lại sau", author: "System error"});
        }
        finally {
            setLoading(false);
        }
    }, [selectedCategory]) // Dependency: chỉ chạy lại khi selectedCategory thay đổi

    useEffect(() => {if(isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    },[isDark]);

    // Quản lý thời gian chờ khi user spam nút generate
    useEffect(() => {
        if(countDown > 0) { 
            const timer = setTimeout(() => setCountDown(countDown - 1), 1000); // Cứ mỗi giây thời gian chờ giảm đi 1
            return () => clearTimeout(timer); // Hết timer -> clear đếm giờ
        } else {
            setIsSpamming(false);
        }
    },[countDown]);

    // Tự động gọi getAIQuote khi selectedCategory thay đổi
    useEffect(() => {
        getAIQuote();
    }, [getAIQuote]) // getAIQuote đã được memoize với useCallback, nên chỉ chạy lại khi selectedCategory thay đổi

    return ( <>
        <div className=" flex flex-col items-center dark:bg-slate-900 bg-white px-4 py-2 rounded-lg shadow-md w-200 min-h-70 transition-colors duration-300">
            <div className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
                <h1 className="mb-10">AI Quote <span className="text-green-700">Generator</span></h1>
            </div>
            
            <div className="random-quote mb-4 w-full">
                {/* Loading effect */}
                {loading ? (
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-4 dark:bg-gray-700 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 dark:bg-gray-700 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ) : (
                    <div className="dark:text-gray-100">
                        <p className="min-h-[70px] text-lg text-center line-clamp-4">"{quote.text}"</p>
                        <p className="text-xl text-right font-bold font-mono">- {quote.author} -</p>
                    </div>
                )}
            </div>

            <div className="flex flex-row gap-4">
                <div className="flex items-center gap-2">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as 'love' | 'life' | 'health' | 'career')}
                        className="p-2 border rounded dark:bg-zinc-200 bg-blue-500 text-white"
                    >
                        <option value="love">Love</option>
                        <option value="life">Life</option>
                        <option value="health">Health</option>
                        <option value="career">Career</option>
                    </select>
                </div>

                <button 
                    className={`bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md hover:cursor-pointer hover:bg-gray-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={getAIQuote}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Get AI Quote"}
                </button>
                <CopyButton textToCopy={`"${quote.text}" - ${quote.author}`} />


                <div className="flex items-center gap-2">
                    <div className="relative inline-block w-11 h-5">
                        <input 
                        id="switch-component" 
                        type="checkbox" 
                        checked={isDark} // Đồng bộ với state isDark
                        onChange={() => setIsDark(!isDark)} // Đổi theme khi click
                        className="peer appearance-none w-11 h-5 bg-slate-200 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" 
                        />
                        <label 
                        htmlFor="switch-component" 
                        className=" flex items-center justify-center absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
                        >
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {isDark ? "🌛" : "☀️"}
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        {/*Box cảnh báo khi spamming*/}
        {isSpamming && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform animate-in zoom-in-95 duration-300">
                    <div className="text-center">
                        <div className="text-5xl mb-4">🐢</div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Từ từ cho tôi thở đã chứ 🤬😮‍💨!
                        </h3>
                        
                        <p className="text-gray-600 mb-6">
                            Bạn đang nhấn quá nhanh. Vui lòng đợi một chút để hệ thống hồi năng lượng nhé.
                        </p>

                        {/* Vòng đếm ngược */}
                        <div className="relative inline-flex items-center justify-center mb-6">
                        <span className="text-3xl font-mono font-bold text-blue-600">
                            {countDown}s
                        </span>
                        </div>

                        <button
                        onClick={() => setIsSpamming(false)} // Nhấn để reset
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
                        >
                            Tôi hiểu rồi
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
    )
}