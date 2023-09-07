import { ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Events } from "discord.js";
import ticketSchema from "../Models/Ticket"
import { ticketParent, everyone } from "../config";

export default {
    name: Events.InteractionCreate,

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction
        const { ViewChannel, SendMessages, MenageChannels, ReadMessageHistory } = PermissionFlagsBits
        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        if (!interaction.isButton()) return

        if (![`member`, `bug`, `other`].includes(customId)) return

        if (!guild.members.me.permissions.has(MenageChannels)) interaction.reply({
            content: "Nie mam permisji do zarządzania kanałami",
            ephemeral: true
        })

        await interaction.reply({
            content: "Ticket został utworzony",
            ephemeral: true
        })
        try {
            await guild.channels.create({
                name: `ticket-${member.user.username}`,
                type: ChannelType.GuildText,
                parent: ticketParent,
                permissionOverwrites: [{
                    id: everyone,
                    deny: [ViewChannel, SendMessages, ReadMessageHistory],
                },
                {
                    id: member.id,
                    allow: [ViewChannel, SendMessages, ReadMessageHistory],
                }
                ],
            }).then(async channel => {
                await ticketSchema.create({
                    GuildID: guild.id,
                    MemberID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                })
                const embed = new EmbedBuilder()
                    .setTitle(`${guild.name} - Ticket: ${customId}`)
                    .setDescription("Administratorzy odpowiedzą wkrótce na twój ticket. Proszę opisać swój problem")
                    .setFooter({
                        text: `Ticket ID: ${ticketId}`,
                        iconURL: member.displayAvatarURL({ dynamic: true })
                    })
                const row = new ActionRowBuilder()
                    .setComponents(
                        new ButtonBuilder()
                            .setCustomId("close")
                            .setLabel(`Zamknij ticket`)
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId("lock")
                            .setLabel(`Zablokuj ticket`)
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("unlock")
                            .setLabel(`Odblokuj ticket`)
                            .setStyle(ButtonStyle.Success),

                    )
                await channel.send({
                    embeds: [embed],
                    components: [row]
                })

                interaction.reply({
                    content: `Ticket został utworzony: ${channel}`,
                    ephemeral: true
                })
            })

        } catch (err) {
            console.log(err)
        }
    }
}