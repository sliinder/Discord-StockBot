const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-prefix")
    .setDescription("Change Your Bot Prefix")
    .addStringOption(option => option.setName("prefix").setRequired(true).setDescription("New Prefix To Change")),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let prefix = await db.get(`prefix_${interaction.guild.id}_${client.user.id}`) || client.config.prefix;
        let newPrefix = interaction.options.getString("prefix");
        if (newPrefix.length > 3) return interaction.reply({content: "Prefix Can't Be More Than 3 Characters" , ephemeral: true}); 
        let confirm =  new MessageButton()
        .setCustomId("change")
        .setLabel('🚀 Confirm')
        .setStyle('SUCCESS')
        .setDisabled(false)
        let cancel = new MessageButton()
        .setCustomId("cancel")
        .setLabel('❌ Cancel')
        .setStyle('DANGER')
        .setDisabled(false)
        const row = new MessageActionRow()
        .addComponents(
            confirm,cancel
           
        )
   

        const embed = new MessageEmbed()
        .setTitle(`**Changing Prefix**`)
        .setDescription('Are You Sure You Wanna Change Your Prefix ?')
        .setColor('#0099ff')
        .addField('**Old Prefix**', `${prefix}`)
        .addField('**New Prefix**', `${newPrefix}`)


  const msg =   await interaction.reply({embeds: [embed] , components: [row] , fetchReply: true});
    const filter = i => i.user.id === interaction.member.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
    collector.on('collect', async i => {
        await i.deferUpdate();

        if (i.customId === 'change') {
            await db.set(`prefix_${interaction.guild.id}_${client.user.id}`, newPrefix);
            await interaction.editReply({content: `*Prefix Changed Successfully \n New Prefix Is: ${newPrefix} *` , embeds: [] , components: []});
        } else if (i.customId === 'cancel') {
            await interaction.editReply({content: '*Operation Cancelled*' ,embeds: [] , components: []});
        }
    })


          


    collector.on('end', async (collected, reason) => {
        if (reason === 'time' && collected.size === 0) {
            await interaction.editReply({content: '*Operation TimedOut*' ,embeds: [] , components: []});
        }
    })



    }
}