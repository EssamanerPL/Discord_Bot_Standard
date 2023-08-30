import { Collection, Events, } from 'discord.js'
import { consola } from 'consola'
import { DEFAULT_COMMAND_COOLDOWN } from '../config'

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {

            const { commandName, client } = interaction
            const { cooldowns } = client

            const command = interaction.client.commands.get(interaction.commandName)

            if (!command) {
                consola.error(`No command matching ${commandName} was found.`)
                return
            }

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection())
            }

            const now = Date.now()
            const timestamps = cooldowns.get(command.data.name)

            const cooldownAmount =
                (command.cooldown ?? DEFAULT_COMMAND_COOLDOWN) * 1000

            const userId = interaction.user.id

            if (timestamps.has(userId)) {
                const expirationTime = timestamps.get(userId) + cooldownAmount

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000)
                    return interaction.reply({
                        content: `Komendę ${commandName} możesz ponownie użyć <t:${expiredTimestamp}:R>.`,
                        ephemeral: true,
                    })
                }
            }

            // Set cooldown
            timestamps.set(userId, now)
            // Delete cooldown
            setTimeout(() => timestamps.delete(userId), cooldownAmount)

            try {
                // Execute command
                await command.execute(interaction)
            } catch (error) {
                consola.error(error)
                await interaction.reply({
                    content: 'Wystąpił błąd podczas wykonywania tego polecenia!',
                    ephemeral: true,
                })
            }
        } else if (interaction.isButton()) {
            // exampleRole1
            if (interaction.customId === `exampleRole1` && interaction.member.roles.cache.has(`1146197533836709908`)) {
                await interaction.member.roles.remove(`1146197533836709908`)
                await interaction.reply({ephemeral: true})
            } else if (interaction.customId === `exampleRole1`) {
                await interaction.member.roles.add(`1146197533836709908`)
                await interaction.reply({ephemeral: true})
            }
            // exampleRole2
            if (interaction.customId === `exampleRole2` && interaction.member.roles.cache.has(`1146197605467033610`)) {
                await interaction.member.roles.remove(`1146197605467033610`)
                await interaction.reply({ephemeral: true, content: ``})
            } else if (interaction.customId === `exampleRole2`) {
                await interaction.member.roles.add(`1146197605467033610`)
                await interaction.reply({ephemeral: true})
            }
            // verification 
            if (interaction.customId === `verify` && interaction.member.roles.cache.has(`1144951567418662922`)) {
                await interaction.member.roles.remove(`1144951567418662922`)
                await interaction.member.roles.add(`1145715107909861539`)
                interaction.reply({ 
                    content: "Pomyslnie zweryfikowano", 
                    ephemeral: true 
                });
            }
        }
    },
}
