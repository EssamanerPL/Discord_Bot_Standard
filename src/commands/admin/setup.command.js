import { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js"
import EventHandler from "../../EventHandler"

export default {

    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(`setup`)
        .setDescription(`setup verification`)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Wybierz kanał")
        ),

    async execute(interaction) {

        const verifyChannel = await interaction.options.getChannel("channel")

        const embedVerify = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Kliknij przycisk aby się zweryfikować`)

        const row = new ActionRowBuilder()
            .setComponents(new ButtonBuilder()
                .setCustomId(`verify`)
                .setLabel(`Weryfikacja`)
                .setStyle(ButtonStyle.Success)

            )

        const response = await verifyChannel.send({
            embeds: [embedVerify],
            components: [row]
        })

    }
}
