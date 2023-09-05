import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, bold} from "discord.js"

export default {

    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(`warn`)
        .setDescription(`Warn user`)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName(`target`)
            .setDescription('Wybierz osobę do ostrzeżenia')
            .setRequired(true)
            )
        .addStringOption(option =>
            option.setName(`reason`)
            .setDescription(`Powód warna`)
            ),

    async execute(interaction) {
		const target = interaction.options.getUser(`target`)
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const confimm = new ButtonBuilder()
        .setCustomId(`confirm`)
        .setLabel(`Warn`)
        .setStyle(ButtonStyle.Primary)

        const cancel = new ButtonBuilder()
        .setCustomId(`cancel`)
        .setLabel(`Anuluj`)
        .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder()
        .addComponents(cancel, confimm)

        let embedStart = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`Czy chcesz ostrzec ${target} z powodu: "${reason}"`)

        let embedCancel = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`${target} Nie dostał warna`)

        const embedWarn = new EmbedBuilder()
        .setColor(`Orange`)
        .setDescription(`${target.username} dostał warna z powodu: ${reason}`)

        const embedDM = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("WARN")
        .setDescription(`${target} dostałeś/aś warna na serwerze: `+ bold(`${interaction.guild.name}`) +  ` z powodu: `+ bold(`${reason}`))
    
 
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
                embeds: [embedWarn],
                ephemeral: false
            })
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
