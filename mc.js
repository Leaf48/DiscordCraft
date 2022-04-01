const mineflayer = require("mineflayer")
const options = {
    host: "",
    username: "",
    password: "",
    version: "1.16"
}
const bot = mineflayer.createBot(options)
// bot.once("spawn", () => {
//     bot.chat("FUCK!")
// })