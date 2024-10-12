const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-role")
    .setDescription("Set A Role For Your Customers (optional)")
    .addRoleOption(option => option.setName("role").setRequired(true).setDescription("Mention The Role You Want To Give To Your Customers")),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let role = interaction.options.getRole("role");
        let roleID = role.id;
        if(!role.id) return interaction.reply({content: `:x:** Invalid Role.**`, ephemeral: true});
        

        let logs = await db.get(`role_${interaction.guild.id}_${client.user.id}`)
        if(logs === null) {

            await db.set(`role_${interaction.guild.id}_${client.user.id}`, roleID);
            const embed = new MessageEmbed()
            .setTitle(`**Customer Role**`)
            .setDescription('Customer Role Changed Successfully To: ' + `${role}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
      let logChannel = interaction.guild.channels.cache.get(log)
      if(!logChannel || log === null) return;
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Role Set")
      .setDescription(`Customer Role Feature Set To: ${role}`)
      .setTimestamp()
      logChannel.send(emb)
        } else if(logs === roleID) {
            return interaction.reply({content: `:x:** Customer Role Is Already ${role} **`, ephemeral: true});
        } else {
            await db.set(`role_${interaction.guild.id}_${client.user.id}`, roleID);
            const embed = new MessageEmbed()
            .setTitle(`**Customer Role**`)
            .setDescription('Customer Role Changed Successfully To: ' + `${role}`)
            .setColor('#0099ff')
            ///.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
      let logChannel = interaction.guild.channels.cache.get(log)
      if(!logChannel || log === null) return;
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Role Set")
      .setDescription(`Customer Role Feature Set To: ${role}`)
      .setTimestamp()
      logChannel.send({embeds:[emb]})
        }
    




          


   



    }
}