const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("delete-category")
    .setDescription("deletes a category from the store")
    .addStringOption(option => option.setName("category-name").setRequired(true).setDescription("The Category Name")),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let cat = interaction.options.getString("category-name").toLowerCase();
        let status = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(status === null) return interaction.reply({content: `:x:** No Categories Found.**`, ephemeral: true});
        let check = status.find(x => x.name === cat)
        if(check === undefined) return interaction.reply({content: `:x:** Category Not Found.**`, ephemeral: true});
        status.splice(status.indexOf(check), 1);
        db.set(`accounts_${interaction.guild.id}_${client.user.id}`, status);
        await interaction.reply({content: `:white_check_mark:** Category Deleted Successfully.**`, ephemeral: true});
        let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
        let logChannel = interaction.guild.channels.cache.get(log)
        if(!logChannel || log === null) return;
        let emb = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle(" Category Deleted")
        .setDescription(`${interaction.member.user.tag} Deleted ${cat} The Category`)
        .setTimestamp()
        logChannel.send({embeds:[emb]})
            
     







          


   



    }
}