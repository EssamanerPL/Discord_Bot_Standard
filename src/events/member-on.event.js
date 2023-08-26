import { EmbedBuilder } from "discord.js"
import { Events } from "discord.js";

export default {
    name: Events.GuildMemberAdd,

    async execute(member) {
        const userRole = await member.guild.roles.cache.get(`1144951567418662922`)
        member.roles.add(userRole)

        const welcome = new EmbedBuilder()
        .setColor("Fuchsia")
        .setTitle("Nowa osoba dołączyła")
        .setThumbnail(member.user.avatarURL({dynamic: true}))
        .setDescription(`Witaj ${member.user} na serwerze ${member.guild}`)
        .setFooter({text: member.user.username, iconURL: member.user.avatarURL({dynamic: true}) })
        .setTimestamp();

        const welcomeChannel = await member.guild.channels.cache.get(`1144928397550694550`)
        await welcomeChannel.fetch()
        welcomeChannel.send({embeds: [welcome]})
    }
    }
