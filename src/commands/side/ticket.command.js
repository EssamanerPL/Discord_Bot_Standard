import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits} from "discord.js"
import { openticket } from "../../config"

export default {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Tworzenie ticketów")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const {guild} = interaction

        const embed = new EmbedBuilder()
        .setDescription("Utwórz ticket na serwerze")

        const row = new ActionRowBuilder() 
        .setComponents(
            new ButtonBuilder()
                .setCustomId(`member`)
                .setLabel(`Zgłoś użytkownika`)
                .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                .setCustomId(`bug`)
                .setLabel(`Zgłoś błąd`)
                .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                .setCustomId(`other`)
                .setLabel(`Inny problem`)
                .setStyle(ButtonStyle.Success),
        )

        await guild.channels.cache.get(openticket).send({
            embeds: [embed],
            components: [row]
        })

        interaction.reply({
            content: "wysłano wiadomość z ticketami",
            ephemeral: true
        })
    }
}