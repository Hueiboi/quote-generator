import { FavQuote } from "../model/favModel.js";

export const getFavQuotes = async (req, res) => {
    const user_id = req.user.id;

    try {
        const data = await FavQuote.getFavQuotes(user_id);
        res.status(200).json({message: "Lấy dữ liệu thành công", data: data});
    } catch (error) {
        console.error("Lỗi không thấy danh sách", error.message);
        res.status(500).json({message: "Lỗi server"});   
    }
}

export const createFavQuotes = async (req, res) => {
    const { id: u } = req.user;
    const { quote: q, author: a, category: c } = req.body;
    try {
        const result = await FavQuote.createFavQuotes(u, q, a, c);
        res.status(201).json(
            {
                message: "Thêm quote vào yêu thích thành công",
                data: result
            }
        ) 
    } catch (error) {
        console.error("Lỗi không thêm được quote", error.message);
        res.status(500).json({message: "Lỗi server"});
    }
}

export const deleteFavQuotes = async (req, res) => {
    const { id: u } = req.user;
    const { id: i } = req.params;
    try {
        const result = await FavQuote.deleteFavQuotes(u, i);
        res.status(200).json(
            {
                message: "Xóa quote thành công",
                result: result
            }
        )
    } catch (error) {
        console.error("Lỗi không xóa được quote", error.message);
        res.status(500).json({message: "Lỗi server"});
    }
}

