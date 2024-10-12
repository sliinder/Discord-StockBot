const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("disable-log")
    .setDescription("Disable the log channel for your bot"),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});


        let logs = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
        if(!logs  || logs === null) {
            return interaction.reply({content: `:x:** Log  Is Already Disabled.**`, ephemeral: true});
            }
        else {
            await db.delete(`feedback_${interaction.guild.id}_${client.user.id}`);
            const embed = new MessageEmbed()
            .setTitle(`**Log Channel**`)
            .setDescription('Log Channel Disabled Successfully')
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
        }
    
    
    
        








          


   



    }
}