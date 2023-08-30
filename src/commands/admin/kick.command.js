import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, bold} from "discord.js"


export default {

    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(`kick`)
        .setDescription(`Eleminate target not permanently from the server`)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName(`target`)
            .setDescription('Wybierz osobę do wyrzucenia')
            )
        .addStringOption(option =>
            option.setName(`reason`)
            .setDescription(`Powód wyrzucenia`)
            ),

    async execute(interaction) {
		const target = interaction.options.getUser(`target`)
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const confimm = new ButtonBuilder()
        .setCustomId(`confirm`)
        .setLabel(`Wyrzuć`)
        .setStyle(ButtonStyle.Danger)

        const cancel = new ButtonBuilder()
        .setCustomId(`cancel`)
        .setLabel(`Anuluj`)
        .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder()
        .addComponents(cancel, confimm)

        let embedStart = new EmbedBuilder()
        .setColor("DarkGold")
        .setDescription(`Czy chcesz wyrzucić ${target} z powodu: "${reason}"`)

        let embedCancel = new EmbedBuilder()
        .setColor("DarkGold")
        .setDescription(`${target} Nie został wyrzucony`)

        const embedKick = new EmbedBuilder()
        .setColor("DarkGold")
        .setDescription(`${target.username} został wyrzucony z serwera: ${interaction.guild.name} z powodu: ${reason}`)

        const embedDM = new EmbedBuilder()
        .setColor("DarkGold")
        .setTitle("KICK")
        .setDescription(`${target} zostałeś/aś wyrzucony/a z serwera: `+ bold(`${interaction.guild.name}`) +  ` z powodu: `+ bold(`${reason}`))
    

        const response = await interaction.reply({
            components: [row],
            embeds: [embedStart],
            ephemeral: true
        })

        const confrimation = await response.awaitMessageComponent({time: 60000})

        if (confrimation.customId === `confirm`) {
            await target.send({
                embeds: [embedDM]
            })
            await confrimation.update({
                components: [],
                embeds: [embedKick],
            })
            await interaction.guild.members.kick(target)
        } else if (confrimation.customId === "cancel") {
            await confrimation.update({
                components: [],
                embeds: [embedCancel]
            })
            }else {
                await confrimation.update({
                    components: []
            })
            }
    } 
}
