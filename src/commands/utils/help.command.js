import { SlashCommandBuilder } from 'discord.js'
import { EmbedBuilder } from 'discord.js'

const embed = new EmbedBuilder()
.setColor('Blue')
.setTitle("POMOC")
.setDescription("komenda 1: /ping \n komenda 2: /help")

export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('test'),

    execute(interaction) {        
        interaction.reply({embeds: [embed] })
    },
}
