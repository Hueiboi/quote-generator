import con from '../config/db.js'

export const FavQuote = {
    getFavQuotes: async(user_id) => {
        const result = await con.query("SELECT * FROM favourites WHERE user_id = $1 ORDER BY created_at", [user_id])
        return result.rows;
    },
    createFavQuotes: async(user_id, quote, author, category) => {
        const result = await con.query(
            "INSERT INTO favourites (user_id, quote, author, category) values ($1, $2, $3, $4)",
        [user_id, quote, author, category]);
        return result.rows[0];
    },
    deleteFavQuotes: async(user_id, id) => {
        const result = await con.query("DELETE FROM favourites WHERE user_id = $1 AND id = $2 RETURNING *", [user_id, id]);
        return result.rows[0];
    }
}