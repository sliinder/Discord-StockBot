const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-buy")
    .setDescription("Set The Buy Channel For Your Bot (optional)")
    .addChannelOption(option => option.setName("buy-channel").setRequired(true).setDescription("Mention The Buy Channel")),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let logChannel = interaction.options.getChannel("buy-channel");
        let channel = logChannel;
        let logChannelID = logChannel.id;
        if(logChannel.type !== "GUILD_TEXT") return interaction.reply({content: `:x:** Invalid Channel.**`, ephemeral: true});
        if(logChannelID === null) return interaction.reply({content: `:x:** Invalid Channel.**`, ephemeral: true});

        let logs = await db.get(`buyChannel_${interaction.guild.id}_${client.user.id}`)
        if(!logs || logs === null) {

            await db.set(`buyChannel_${interaction.guild.id}_${client.user.id}`, logChannelID);
            const embed = new MessageEmbed()
            .setTitle(`**Buy Channel**`)
            .setDescription('Buy Channel Changed Successfully To: ' + `${logChannel}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
      let bag = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
      let bagChannel = interaction.guild.channels.cache.get(bag)
      if(!bagChannel || bag === null) return;
            let emb = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Buy Channel Set")
            .setDescription(`Buy Channel Feature Set To: ${channel}`)
            .setTimestamp()
            bagChannel.send({embeds: [emb]})
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
        } else if(logs === logChannelID) {
            return interaction.reply({content: `:x:** Buy Channel Is Already ${channel} **`, ephemeral: true});
        } else {
            await db.set(`buyChannel_${interaction.guild.id}_${client.user.id}`, logChannelID);
            const embed = new MessageEmbed()
            .setTitle(`**Buy Channel**`)
            .setDescription('Buy Channel Changed Successfully To: ' + `${channel}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let bag = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
      let bagChannel = interaction.guild.channels.cache.get(bag)
      if(!bagChannel || bag === null) return;
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle(" Buy Channel Set")
      .setDescription(`Buy Channel Feature Set To: ${channel}`)
      .setTimestamp()
      bagChannel.send({embeds:[emb]})

        }
    
    
    
        








          


   



    }
}