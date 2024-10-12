const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("add-admin")
    .setDescription("adds an admin to moderate the bot")
    .addUserOption(option => option.setName("admin").setRequired(true).setDescription("Mention Or Put The Admin ID")),

    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let admin = interaction.options.getUser("admin")
        let data = await db.get(`admins_${interaction.guild.id}_${client.user.id}`)
        if(!data || data === null) {
            db.set(`admins_${interaction.guild.id}_${client.user.id}`, [admin.id]);
            try {
                await admin.send({content: `:white_check_mark:** You Have Been Added As An Admin.**`});
                
            } catch (error) {
                console.log(error);
                
            }
             interaction.reply({content: `:white_check_mark:** Admin Added Successfully.**`});
             let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
             let logChannel = interaction.guild.channels.cache.get(log)
             if(!logChannel || log === null) return;
             let embed = new MessageEmbed()
             .setColor("#00ff00")
             .setTitle("Admin Added")
             .setDescription(`${interaction.member.user.tag} Added ${admin} As An Admin`)
             .setTimestamp()
             logChannel.send({embeds:[embed]})
            } else {
            if(data.includes(admin.id)) return interaction.reply({content: `:x:** Admin Already Exists.**`, ephemeral: true});
            data.push(admin.id);
            try {
                await admin.send({content: `:white_check_mark:** You Have Been Added As An Admin.**`});
                
            } catch (error) {
                console.log(error);
                
            }
            db.set(`admins_${interaction.guild.id}_${client.user.id}`, data);
             interaction.reply({content: `:white_check_mark:** Admin Added Successfully.**`});
            let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
            let logChannel = interaction.guild.channels.cache.get(log)
            if(!log || log === null) return;
            let embed = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Admin Added")
            .setDescription(`${interaction.member.user.tag} Added ${admin} As An Admin`)
            .setTimestamp()
            logChannel.send({embeds:[embed]})
    
        }

       
     







          


   



    }
}