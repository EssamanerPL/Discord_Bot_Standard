import { consola } from 'consola'
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'
import packageJson from '../package.json' assert { type: 'json' }
import CommandHandler from './CommandHandler.js'
import EventHandler from './EventHandler.js'
import AntiCrash from './anti-crash.js'
import { TOKEN } from './config.js'

// Anti bot crash system
AntiCrash.init()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})

// client.on(`guildMemberAdd`, member => {
//     console.log("member join")
//     const welcome = new EmbedBuilder()
//     .setColor("Blue")
//     .setTitle("Nowa osoba dołączyła")
//     .setDescription(`Witaj <@${member.user.id}> na serwerze ${member.guild}`)
//     .setFooter({text: member.user.username, iconURL: member.user.avatarURL({dynamic: true}) })
//     .setTimestamp();

//     member.guild.channels.get(`1144928397550694550`).send({embeds: [welcome]})
// })

// Handlers
const commandHandler = new CommandHandler(client)
const eventHandler = new EventHandler(client)

consola.start(`Starting app '${packageJson.name}'`)
consola.box(`Author:  ${packageJson.author}\nVersion: ${packageJson.version}`)

// Register commands
await Promise.all([commandHandler.loadCommand('./commands/utils/ping.command'),commandHandler.loadCommand('./commands/utils/help.command')])

commandHandler.displayLoadedCommands()

// Add handlers to the client
client.commandHandler = commandHandler
client.eventHandler = eventHandler

// Login bot
client.login(TOKEN)
