const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Change Your Store Status (open/close)")
    .addStringOption(option => option.setName("status").setRequired(true).setDescription("The New Store Status (open/close)").addChoices(
        { name: 'Open', value: 'open' },
        { name: 'Close', value: 'close' },
    )),
    run : async (client, interaction, args) => {	
        let admins = await db.get(`admins_${interaction.guild.id}_${client.user.id}`)
        if(!admins || admins === null) {
            if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});
        } else {
            if(client.config.ownerID !== interaction.member.id && !admins.includes(interaction.member.id)) return interaction.reply({content: `:x:**You Are Not An Admin.**`, ephemeral: true});
        }

        let newStatus = interaction.options.getString("status");

        let status = await db.get(`store_${interaction.guild.id}_${client.user.id}`) 
        if(status === null) {
            await db.set(`store_${interaction.guild.id}_${client.user.id}`, newStatus);
            const embed = new MessageEmbed()
            .setTitle(`**Changing Store Status**`)
            .setDescription('Store Status Changed Successfully To: ' + ` ${newStatus}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
      let logChannel = interaction.guild.channels.cache.get(log)
      if(!logChannel || log === null) return;
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Store Status")
      .setDescription(`${interaction.member.user.tag} Changed The Store Status To: ` + ` ${newStatus}`)
      .setTimestamp()
      logChannel.send(emb)
        } else if(status === newStatus) {
            return interaction.reply({content: `:x:** Store Is Already ${newStatus} **`, ephemeral: true});
        } else {
            await db.set(`store_${interaction.guild.id}_${client.user.id}`, newStatus);
            const embed = new MessageEmbed()
            .setTitle(`**Changing Store Status**`)
            .setDescription('Store Status Changed Successfully To: ' + ` ${newStatus}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
      let logChannel = interaction.guild.channels.cache.get(log)
      if(!logChannel || log === null) return;
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Store Status")
      .setDescription(`${interaction.member.user.tag} Changed The Store Status To: ` + ` ${newStatus}`)
      .setTimestamp()
      logChannel.send({embeds:[emb]})
        }








          


   



    }
}