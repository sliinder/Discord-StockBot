const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-stock")
    .setDescription("Set A stock Channel For Your Bot (optional)")
    .addChannelOption(option => option.setName("stock-channel").setRequired(true).setDescription("Mention The stock Channel")),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let logChannel = interaction.options.getChannel("stock-channel");
        let logChannelID = logChannel.id;
        if(logChannel.type !== "GUILD_TEXT") return interaction.reply({content: `:x:** Invalid Channel.**`, ephemeral: true});
        if(logChannelID === null) return interaction.reply({content: `:x:** Invalid Channel.**`, ephemeral: true});

        let logs = await db.get(`stock_${interaction.guild.id}_${client.user.id}`)
        if(logs === null) {

            await db.set(`stock_${interaction.guild.id}_${client.user.id}`, logChannelID);
            const embed = new MessageEmbed()
            .setTitle(`**stock Channel**`)
            .setDescription('stock Channel Changed Successfully To: ' + `${logChannel}`)
            .setColor('#0099ff')
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
      let logChannel = interaction.guild.channels.cache.get(log)
      if(!logChannel || log === null) return;
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("stock Channel Set")
      .setDescription(`stock Feature Set To: ${log}`)
      .setTimestamp()
      logChannel.send(emb)
        } else if(logs === logChannelID) {
            return interaction.reply({content: `:x:** stock Channel Is Already ${logChannel} **`, ephemeral: true});
        } else {
            await db.set(`stock_${interaction.guild.id}_${client.user.id}`, logChannelID);
            const embed = new MessageEmbed()
            .setTitle(`**stock Channel**`)
            .setDescription('stock Channel Changed Successfully To: ' + `${logChannel}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
      let logChannel = interaction.guild.channels.cache.get(log)
      if(!logChannel || log === null) return;
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Stock Channel Set")
      .setDescription(`Stock Feature Set To: ${log}`)
      .setTimestamp()
      logChannel.send({embeds:[emb]})
        }
    
    
    
        








          


   



    }
}