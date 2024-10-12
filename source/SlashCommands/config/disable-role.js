const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("disable-role")
    .setDescription("Disable the customer role for your bot"),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});


        let logs = await db.get(`role_${interaction.guild.id}_${client.user.id}`)
        if(!logs || logs === null) {
            return interaction.reply({content: `:x:** Role Is Already Disabled.**`, ephemeral: true});
            }
        else {
            await db.delete(`role_${interaction.guild.id}_${client.user.id}`);
            const embed = new MessageEmbed()
            .setTitle(`**Customer Role**`)
            .setDescription('Customer Role Disabled Successfully')
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
            let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
            let logChannel = interaction.guild.channels.cache.get(log)
            if(!logChannel || log === null) return;
            let emb = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Role Disabled")
            .setDescription(`${interaction.member.user.tag} Disabled The Customer Role Feature`)
            .setTimestamp()
            logChannel.send({embeds:[emb]})
        }
    
    
    
        








          


   



    }
}