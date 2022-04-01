const Discord = require("discord.js")
const {Client, Intents, MessageActionRow, MessageButton} = require("discord.js")
const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const {token, prefix} = require("./config.json")
const wait = require('util').promisify(setTimeout);
const mineflayer = require("mineflayer")


client.once("ready", ()=>{
    console.log("Bot has been enabled!")
})

let bot = null
client.on("messageCreate", async message=>{
    const {author, channel, guild, content, member} = message
    if(author.bot) return

    if(content === `${prefix}mc`){
        const start = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("START")
                    .setStyle("PRIMARY")
                    .setCustomId("start")
            )
        const stop = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("STOP")
                    .setStyle("DANGER")
                    .setCustomId("stop")
            )

        const msg = await channel.send({content: "Minecraft Bot", components: [start, stop]})

        const filter = i => (i.customId === "start" || i.customId === "stop") && i.user.id === member.id

        const collector = msg.channel.createMessageComponentCollector({filter, time: 1000 * 150})
        collector.on("collect", async i =>{
            // console.log(i)
            if(i.customId === "start"){
                // console.log("START")
                const options = {
                    host: "",
                    username: "",
                    password: "",
                    version: "1.16",
                    viewDistance: "tiny"
                }
                const bot = mineflayer.createBot(options)
                await bot.chat("Hello!")

                const start = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("START")
                            .setStyle("PRIMARY")
                            .setCustomId("start")
                            .setDisabled(true)
                    )
                await i.update({content: "Bot has been started!", components:[start, stop]})


            }else if(i.customId === "stop"){
                // console.log("STOP")
                stopBot(bot)
                const stop = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("STOP")
                            .setStyle("DANGER")
                            .setCustomId("stop")
                            .setDisabled(true)
                    )
                await i.update({content: "Bot has been stopped!", components:[start, stop]})
            }

        })

        collector.on("end", collected=>{
            console.log(`collected ${collected.size} items!`)
        })
    }
})


async function startBot(){
    const options = {
        host: "",
        username: "",
        password: "",
        version: "",
        viewDistance: ""
    }
    const bot = mineflayer.createBot(options)
    return bot
}

async function stopBot(bot){
    try{
        bot.end()
    }catch(err){
        console.log(err)
    }
}

client.login(token)