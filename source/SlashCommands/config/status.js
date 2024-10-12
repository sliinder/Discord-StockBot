const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-status")
    .setDescription("Change Your Bot Status")
    .addStringOption(option => option.setName("status").setRequired(true).setDescription("The New Status")),
    run : async (client, interaction, args) => {	
        let status = await db.get(`status_${client.user.id}`) || client.config.Activity;
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let newStatus = interaction.options.getString("status");
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
        .setTitle(`**Changing Status**`)
        .setDescription('Are You Sure You Wanna Change Your Bot Status ?')
        .setColor('#0099ff')
        .addField('**Old Status**', `${status}`)
        .addField('**New Status**', `${newStatus}`)


  const msg =   await interaction.reply({embeds: [embed] , components: [row] , fetchReply: true});
    const filter = i => i.user.id === interaction.member.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
    collector.on('collect', async i => {
        await i.deferUpdate();

        if (i.customId === 'change') {
            await db.set(`status_${client.user.id}`, newStatus);
            await client.user.setActivity({name: `${newStatus}`, type: `${client.config.ActivityType}`});
            await interaction.editReply({content: `*Status Changed Successfully \n New Status Is: ${newStatus} *` , embeds: [] , components: []});
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