const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-probot")
    .setDescription("Enter Your ProBot ID (Not Required If It Was The Main Probot)")
    .addUserOption(option => option.setName("probot-id").setRequired(true).setDescription("New Probot ID")),
    run : async (client, interaction, args) => {	
        let newID = interaction.options.getUser("probot-id");
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        if(!newID) return interaction.reply({content: `:x:** Invalid Probot ID.**`, ephemeral: true});
        if (newID.id.length < 13) return interaction.reply({content: "Invalid ID" , ephemeral: true}); 
        let id = await db.get(`probot_${interaction.guild.id}_${client.user.id}`)
        if(id && id === newID.id) return interaction.reply({content: `:x:** Probot Already Set To This ID.**`, ephemeral: true});
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
        .setTitle(`**Changing Probot ID**`)
        .setDescription('Are You Sure You Wanna Change Your Probot ID ?')
        .setColor('#0099ff')
        .addField('**Old ID**', `${id ? id : "1032367534126678096"}`)
        .addField('**New ID**', `${newID.id}`)


  const msg =   await interaction.reply({embeds: [embed] , components: [row] , fetchReply: true});
    const filter = i => i.user.id === interaction.member.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
    collector.on('collect', async i => {
        await i.deferUpdate();

        if (i.customId === 'change') {
            await db.set(`probot_${interaction.guild.id}_${client.user.id}`, newID.id);
            await interaction.editReply({content: `*Probot ID Changed Successfully \n New ID Is: ${newID.id} *` , embeds: [] , components: []});
            let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
            let logChannel = interaction.guild.channels.cache.get(log)
            if(!logChannel || log === null) return;
            let emb = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("ProBot ID Set")
            .setDescription(`Probot ID Changed To ${newID.id}`)
            .setTimestamp()
            logChannel.send({embeds:[emb]})
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