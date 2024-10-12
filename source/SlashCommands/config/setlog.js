const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-log")
    .setDescription("Set A Log Channel For Your Bot")
    .addChannelOption(option => option.setName("log-channel").setRequired(true).setDescription("Mention The Log Channel (it must be hidden from members)")),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let logChannel = interaction.options.getChannel("log-channel");
        let logChannelID = logChannel.id;
        if(logChannel.type !== "GUILD_TEXT") return interaction.reply({content: `:x:** Invalid Channel.**`, ephemeral: true});
        if(logChannelID === null) return interaction.reply({content: `:x:** Invalid Channel.**`, ephemeral: true});

        let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
        if(log === null) {

            await db.set(`log_${interaction.guild.id}_${client.user.id}`, logChannelID);
            const embed = new MessageEmbed()
            .setTitle(`**Log Channel**`)
            .setDescription('Log Channel Changed Successfully To: ' + `${logChannel}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Log Channel Set")
      .setDescription(`Log Feature Set Successfully < Here You Will See All Your Bot's Logs >`)
      .setTimestamp()
      logChannel.send({embeds:[emb]})
        } else if(log === logChannelID) {
            return interaction.reply({content: `:x:** Log Channel Is Already ${logChannel} **`, ephemeral: true});
        } else {
            await db.set(`log_${interaction.guild.id}_${client.user.id}`, logChannelID);
            const embed = new MessageEmbed()
            .setTitle(`**Log Channel**`)
            .setDescription('Log Channel Changed Successfully To: ' + `${logChannel}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Log Channel Set")
      .setDescription(`Log Feature Set Successfully < Here You Will See All Your Bot's Logs >`)
      .setTimestamp()
      logChannel.send({embeds:[emb]})
      
        }
    
    
    
        








          


   



    }
}