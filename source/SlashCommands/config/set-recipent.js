const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-recipent")
    .setDescription("قم بوضع ايدي الشخص الذي تريد ان يتم التحويل له")
    .addUserOption(option => option.setName("recipent").setRequired(true).setDescription("قم بمنشن او وضع ايدي الشخص المتلقي"))
    .addStringOption(option => option.setName("category-name").setRequired(true).setDescription("قم بوضع القسم الذي تريد ان يتلقى منه ")),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let user = interaction.options.getUser("recipent");
        let cat = interaction.options.getString("category-name").toLowerCase();
        let status = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(!status || status === null) return interaction.reply({content: `:x:** No Categories Found.**`, ephemeral: true});

        let check = status.find(x => x.name === cat)
        if(check === undefined) return interaction.reply({content: `:x:** Category Not Found.**`, ephemeral: true});
        check.recipent = user.id;
        db.set(`accounts_${interaction.guild.id}_${client.user.id}`, status);
        await interaction.reply({content: `:white_check_mark:** Recipent For The Category ${cat} Set Successfully To ${user.username}.**`});

        let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
        let logChannel = interaction.guild.channels.cache.get(log)
        if(!logChannel || log === null) return;
        let emb = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle(" Recipent Set")
        .setDescription(`لقد قام ${interaction.member.user.tag} بتحديد الشخص المتلقي لقسم ${cat}`)
        .setTimestamp()
        logChannel.send({embeds:[emb]})



    }
}