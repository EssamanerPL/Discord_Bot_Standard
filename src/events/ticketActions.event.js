import { createTranscript } from "discord-html-transcripts";
import { ButtonBuilder, EmbedBuilder, Events, PermissionFlagsBits } from "discord.js";
import { transcripts } from "../config";
import ticketSchema from "../Models/Ticket";

export default {
    name: Events.InteractionCreate,

    async execute(interaction) {
        const { guild, member, customId: interactionCustomId, channel } = interaction
        const customId = interactionCustomId.split("-")[2]
        const { ManageChannels, SendMessages } = PermissionFlagsBits

        if (!interaction.isButton()) return
        if (!guild.members.me.permissions.has(ManageChannels)) return interaction.reply({
            content: "Nie mam permisji do zarządzania kanałami",
            ephemeral: true
        })

        const embed = new EmbedBuilder()
            .setColor("Yellow")

        console.log(ticketSchema)
        
        ticketSchema.findOne(
            {
                ChannelID: channel.id 
            }, 
            async (err, data) => {
                if (err) throw err;
                if (!data) return interaction.reply({
                    content: "Coś poszło nie tak",
                    ephemeral: true
                });

                const fetchedMember = await guild.members.fetch(data.MemberID);

                switch (customId) {
                    case "ticket-actions-close":
                        if (data.closed == true)
                            return interaction.reply({
                                content: "Ten ticket został już zamknięty",
                                ephemeral: true
                            });
                        const transcript = await createTranscript(channel, {
                            limit: -1,
                            returnBuffer: false,
                            filename: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`
                        });

                        await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: true });

                        const transcriptEmbed = new EmbedBuilder()
                            .setColor("Aqua")
                            .setTitle("Transkrypcja")
                            .setTimestamp()
                            .setFooter({ text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) });

                        const transcriptProcessEmbed = new EmbedBuilder()
                            .setColor("Aqua")
                            .setTitle("Trwa tworzenie transkrypcji... Proszę czekać")
                            .setDescription("Ticket zostanie zamknięty za 10 sekund. W wiadomości prywatnej otrzymasz link do transkrypcji")
                            .setColor("Aqua")
                            .setFooter({ text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        const res = await guild.channels.cache.get(transcripts).send({
                            embeds: [transcriptEmbed],
                            files: [transcript]
                        });

                        channel.send({
                            embeds: [transcriptProcessEmbed]
                        });

                        setTimeout(function () {
                            member.send({
                                embeds: [transcriptEmbed.setDescription(`Uzyskaj dostęp do transkrypcji twojego ticketu: ${res.url}`)]
                            }).catch(() => channel.send(`Nie mogę wysłać wiadomości prywatnej do ${member.user.tag}`));
                        }, 10000);

                        break;

                    case "ticket-actions-lock":
                        if (!member.permissions.has(ManageChannels))
                            return interaction.reply({
                                content: "Nie masz permisji do zarządzania kanałami",
                                ephemeral: true
                            });

                        if (data.locked == true)
                            return interaction.reply({
                                content: "Ten ticket jest już zablokowany",
                                ephemeral: true
                            });

                        await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: true });
                        embed.setDescription(`Ticket został zablokowany przez ${member.user.tag}`);

                        channel.permissionsOverwrites.edit(fetchedMember, { SendMessages: false });

                        return interaction.reply({
                            embeds: [embed]
                        });

                    case "ticket-actions-unlock":
                        if (!member.permissions.has(ManageChannels))
                            return interaction.reply({
                                content: "Nie masz permisji do zarządzania kanałami",
                                ephemeral: true
                            });

                        if (data.locked == false)
                            return interaction.reply({
                                content: "Ten ticket jest już odablokowany",
                                ephemeral: true
                            });

                        await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: false });
                        embed.setDescription(`Ticket został odblokowany przez ${member.user.tag}`);

                        channel.permissionsOverwrites.edit(fetchedMember, { SendMessages: true });

                        return interaction.reply({
                            embeds: [embed]
                        });
                }
            })
    }  
}
