import { createTranscript } from "discord-html-transcripts";
import { ButtonBuilder, EmbedBuilder, Events, PermissionFlagsBits } from "discord.js";
import { transcripts } from "../config";
import ticketSchema from "../Models/Ticket";

export default {
    name: Events.InteractionCreate,

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction
        const { ManageChannels, SendMessages } = PermissionFlagsBits

        if (!interaction.isButton()) return

        if (!guild.members.me.permissions.has(ManageChannels)) return interaction.reply({
            content: "Nie mam permisji do zarządzania kanałami",
            ephemeral: true
        })

        const embed = new EmbedBuilder()
            .setColor("Yellow")
        
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

                console.log(`customId: ${customId}`)

                switch (customId) {
                    case "close":
                        if (data.Closed == true) {
                            return interaction.reply({
                                content: "Ten ticket został już zamknięty",
                                ephemeral: true
                            })}
                        
                        const transcript = await createTranscript(channel, ``,{
                            limit: -1,
                            returnBuffer: false,
                            filename: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`
                        });

                        await ticketSchema.updateMany( {channelID: channel.id}, { Closed: true });
                            console.log(`closed?: ${ticketSchema.Closed}`)
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
                            guild.channels.delete(channel.id)
                            member.send({
                                embeds: [transcriptEmbed.setDescription(`Uzyskaj dostęp do transkrypcji twojego ticketu: ${res.url}`)]
                            }).catch(() => channel.send(`Nie mogę wysłać wiadomości prywatnej do ${member.user.tag}`));
                        }, 10000);

                        break;

                    case "lock":
                        if (!member.permissions.has(ManageChannels))
                            return interaction.reply({
                                content: "Nie masz permisji do zarządzania kanałami",
                                ephemeral: true
                            });
                        if (data.Locked == true)
                            return interaction.reply({
                                content: "Ten ticket jest już zablokowany",
                                ephemeral: true
                            }); 

                        await ticketSchema.updateMany( {channelID: channel.id}, { Locked: true });
                        embed.setDescription(`Ticket został zablokowany przez ${member.user}`);

                        channel.permissionOverwrites.edit(fetchedMember, { SendMessages: false });

                        return interaction.reply({
                            embeds: [embed]
                        });

                        case "unlock":
                            if (!member.permissions.has(ManageChannels))
                                return interaction.reply({
                                    content: "Nie masz permisji do zarządzania kanałami",
                                    ephemeral: true
                                });
                            if (data.Locked == false)
                                return interaction.reply({
                                    content: "Ten ticket jest już odblokowany",
                                    ephemeral: true
                                }); 
    
                            await ticketSchema.updateMany( {channelID: channel.id}, { Locked: false });
                            embed.setDescription(`Ticket został odblokowany przez ${member.user}`);

                            channel.permissionOverwrites.edit(fetchedMember, { SendMessages: true });

                            return interaction.reply({
                                embeds: [embed]
                            });
                }
            })
    }  
}
