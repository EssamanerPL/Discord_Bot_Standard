import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, bold, Client } from "discord.js"

import ms from "ms"

export default {

    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(`unmute`)
        .setDescription(`unmute user`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName("target")
                .setDescription('Wybierz osobę do odciszenia')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(`reason`)
                .setDescription(`Powód odciszenia (opcjonalne)`)
        ),

    async execute(interaction) {
        const { guild, options } = interaction

        const user = options.getUser("target")
        const member = guild.members.cache.get(user.id)
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const succesEmbed = new EmbedBuilder()
            .setColor(`Orange`)
            .setTitle(bold("UNMUTED"))
            .setDescription(`${user} został odciszony`)
            .setFields(
                { name: "Powód", value: `${reason}`, inline: true }            )
            .setTimestamp()

        const errEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Nie możesz mutować osoby z wyższą rangą!`)

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                embeds: [errEmbed],
                ephemeral: true
            })
        }

        try {
            await member.timeout(null)

            interaction.reply({
                embeds: [succesEmbed],
                ephemeral: true
            })
        } catch (err) {
            console.log(err)
        }
    }
}
