import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, bold} from "discord.js"


export default {

    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(`ban`)
        .setDescription(`Eleminate target permanently from the server`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName(`target`)
            .setDescription('Wybierz osobę do zbanowania')
            .setRequired(true)
            )
        .addStringOption(option =>
            option.setName(`reason`)
            .setDescription(`Powód bana`)
            ),

    async execute(interaction) {
		const target = interaction.options.getUser(`target`)
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const confimm = new ButtonBuilder()
        .setCustomId(`confirm`)
        .setLabel(`Zbanuj`)
        .setStyle(ButtonStyle.Danger)

        const cancel = new ButtonBuilder()
        .setCustomId(`cancel`)
        .setLabel(`Anuluj`)
        .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder()
        .addComponents(cancel, confimm)

        let embedStart = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`Czy chcesz zbanować ${target} z powodu: "${reason}"`)

        let embedCancel = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`${target} Nie został zbanowany`)

        const embedBan = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`${target.username} został zbanowany z powodu: ${reason}`)

        const embedDM = new EmbedBuilder()
        .setColor("Red")
        .setTitle("BAN")
        .setDescription(`${target} zostałeś/aś zbanowany/a z serwera: `+ bold(`${interaction.guild.name}`) +  ` z powodu: `+ bold(`${reason}`))
    

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
            await interaction.guild.members.ban(target)
            await confrimation.update({
                components: [],
                embeds: [embedBan]
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
