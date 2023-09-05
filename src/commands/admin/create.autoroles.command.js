import { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js"

export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(`createautorole`)
        .setDescription(`create auto role message`)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Wybierz kanał")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("role")
                .setDescription("Wybierz role do nadawania")
                .setRequired(true)
        ),

    async execute(interaction) {

        const channel = await interaction.options.getChannel("channel")
        const role = await interaction.options.getRole("role")

        const embedRole = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`Kliknij przycisk aby otrzymać rolę`)
            .setDescription(`Nadawana rola: ${role}`)
            .setFooter({
                text: `Kliknij ponowanie aby usunąć`
            })

        const row = new ActionRowBuilder()
            .setComponents(new ButtonBuilder()
                .setCustomId(`${role.name}`)
                .setLabel(`Otrzymaj role`)
                .setStyle(ButtonStyle.Success)
            )
        await channel.send({
            embeds: [embedRole],
            components: [row]
        })

    }
}
