const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("remove-admin")
    .setDescription("removes an admin from the bot")
    .addUserOption(option => option.setName("admin").setRequired(true).setDescription("Mention Or Put The Admin ID")),

    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let admin = interaction.options.getUser("admin")
        let data = await db.get(`admins_${interaction.guild.id}_${client.user.id}`)
        if(!data || data === null) return interaction.reply({content: `:x:** No Admins Found.**`, ephemeral: true}); 
        
            if(!data.includes(admin.id)) return interaction.reply({content: `:x:** Admin Not Found.**`, ephemeral: true});
            data.splice(data.indexOf(admin.id), 1);
            await db.set(`admins_${interaction.guild.id}_${client.user.id}`, data);
             interaction.reply({content: `:white_check_mark:** Admin Removed Successfully.**`});
        

       
     







          


   



    }
}