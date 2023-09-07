import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, bold, Client } from "discord.js"

import ms from "ms"

export default {

    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(`mute`)
        .setDescription(`Mute or unmute user`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName("target")
                .setDescription('Wybierz osobę do wyciszenia')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("time")
                .setDescription("Czas mute")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(`reason`)
                .setDescription(`Powód wyciszenia (opcjonalne)`)
        ),

    async execute(interaction) {
        const { guild, options } = interaction

        const user = options.getUser("target")
        const member = guild.members.cache.get(user.id)
        const time = options.getString("time")
        const convertedTime = ms(time)
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const succesEmbed = new EmbedBuilder()
            .setColor(`Orange`)
            .setTitle(bold("MUTED"))
            .setDescription(`${user} został wyciszony`)
            .setFields(
                { name: "Powód", value: `${reason}`, inline: true },
                { name: "Czas", value: `${time}`, inline: true }
            )
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
            await member.timeout(convertedTime, reason)

            interaction.reply({
                embeds: [succesEmbed],
                ephemeral: true
            })
        } catch (err) {
            console.log(err)
        }
    }
}
