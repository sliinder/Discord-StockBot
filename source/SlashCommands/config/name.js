const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-name")
    .setDescription("Change Your Bot Name")
    .addStringOption(option => option.setName("name").setRequired(true).setDescription("The New Name")),
    run : async (client, interaction, args) => {	
        let name = client.user.username;
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let newName = interaction.options.getString("name");
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
        .setTitle(`**Changing Name**`)
        .setDescription('Are You Sure You Wanna Change Your Bot Name ?')
        .setColor('#0099ff')
        .addField('**Old Name**', `${name}`)
        .addField('**New Name**', `${newName}`)


  const msg =   await interaction.reply({embeds: [embed] , components: [row] , fetchReply: true});
    const filter = i => i.user.id === interaction.member.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
    collector.on('collect', async i => {
        await i.deferUpdate();

        if (i.customId === 'change') {
            try {
                await client.user.setUsername(`${newName}`);
                await interaction.editReply({content: `*Name Changed Successfully \n New Name Is: ${newName} *` , embeds: [] , components: []});

            } catch (error) {
                await interaction.editReply({content: `:x:** Error: ${error} **`, embeds: [] , components: []});
                
            }
                
            
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