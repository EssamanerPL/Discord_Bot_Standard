import { Events } from 'discord.js'
import chalk from 'chalk'
import { consola } from 'consola'
import mongoose from 'mongoose'

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        consola.success(
            chalk.greenBright(`Zalogowano jako ${client.user.tag}!`),
        )

        // Register commands and events
        await client.commandHandler.registerGuildCommands()

        // Connect to database
        await mongoose.connect(process.env.MONGODB || ``, {
            keepAlive: true,
        })

        if (mongoose.connect) {
            consola.success(
                chalk.greenBright(`Połączono z bazą danych!`),
            )
        }
    },
}
