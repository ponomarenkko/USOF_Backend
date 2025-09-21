import "dotenv/config"

import app from "./api/app.js";

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is listening: http://localhost:${PORT}`)
})
