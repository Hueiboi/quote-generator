import { model } from "../config/gemini.js";

export const generateQuote = async (req, res) => {
    try {
        const { category } = req.body;

        //1. Xây dựng prompt cho Gemini
        const prompt = `Bạn là một chuyên gia về danh ngôn.
        Hãy tạo 1 câu quote ngẫu nhiên nếu không được truyền vào category,
        nếu được truyền vào category thì hãy tạo 1 câu quote ngẫu nhiên cho category đó. Category có thể là: ${category}.
        Yêu cầu trả về duy nhất 1 định dạng JSON thuần túy như sau, không kèm văn bản giải thích hoặc nội dung khác
        {
            "content": "Câu quote ngẫu nhiên hoặc câu quote cho category được truyền vào",
            "author": "Tên tác giả của câu quote"
        }`;

        //2. Tạo response từ Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        //3. Xử lý response thô từ Gemini (regex / replace)
        const cleanJson = text.replace(/```json|```/g, "").trim(); // Lấy đúng định dạng JSON loại bỏ text khác
        const quoteObj = JSON.parse(cleanJson);

        res.status(200).json(quoteObj);
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({error: "Failed to generate quote"});
    }
}