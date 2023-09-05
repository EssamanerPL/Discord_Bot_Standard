import { ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Events } from "discord.js";
import ticketSchema from "../Models/Ticket"
import { ticketParent, everyone } from "../config";

export default {
    name: Events.InteractionCreate,

    async execute(interaction) {
        const { guild, member, customId: interactionCustomId, channel } = interaction
        if (!interactionCustomId.startsWith("create-ticket")) return;
        const customId = interactionCustomId.split("-")[2]
        const { ViewChannel, SendMessages, MenageChannels, ReadMessageHistory } = PermissionFlagsBits
        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        if (!interaction.isButton()) return

        if (!guild.members.me.permissions.has(MenageChannels)) interaction.reply({
            content: "Nie mam permisji do zarządzania kanałami",
            ephemeral: true
        })

        await interaction.reply({
            content: "Ticket został utworzony",
            ephemeral: true
        })
        try {
            const channel = await guild.channels.create({
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
            })

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
                        .setCustomId("ticket-actions-close")
                        .setLabel(`Zamknij ticket`)
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId("ticket-actions-lock")
                        .setLabel(`Zablokuj ticket`)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("ticket-actions-unlock")
                        .setLabel(`Odblokuj ticket`)
                        .setStyle(ButtonStyle.Success),

                )

            await channel.send({
                embeds: [embed],
                components: [row]
            })

        } catch (err) {
            console.log(err)
        }
    }
}