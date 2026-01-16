import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    // 1. Lấy token từ req.headers['authorization']
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
    // 2. Nếu không có token -> res.status(401)
    if(!token) {
        return res.status(401).json({message: "Can dang nhap de thuc hien thao tac"})
    }
    // 3. jwt.verify(token, SECRET, (err, decoded) => {
    //      nếu có err -> res.status(403)
    //      nếu ok -> gán req.user = decoded rồi gọi next()
    //    })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({message: "Token khong hop le hoac het han"})
    }
}

export default verifyToken