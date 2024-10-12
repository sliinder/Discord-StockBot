const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-price")
    .setDescription("Set The Price Of Your Category")
    .addStringOption(option => option.setName("category-name").setRequired(true).setDescription("The Category Name To Set Its Price"))
    .addNumberOption(option => option.setName("the-price").setRequired(true).setDescription("Put The Category Price")),

    run : async (client, interaction, args) => {	

        let cat = interaction.options.getString("category-name").toLowerCase();
        let data = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(data === null) return interaction.reply({content: `:x:** No Categories Exist **`, ephemeral: true});

        let category = data.find(x => x.name === cat)

        if(category === undefined) return interaction.reply({content: `:x:** Category Not Found **`, ephemeral: true});
        if(client.config.ownerID !== interaction.member.id && check.recipent !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let price = interaction.options.getNumber("the-price");
        if(price < 0) return interaction.reply({content: `:x:** Price Cannot Be Negative **`, ephemeral: true});
        
        let tax = Math.floor(price * (20 / 19) + 1);
        category.price = price;
        category.tax = tax;
        await db.set(`accounts_${interaction.guild.id}_${client.user.id}`, data);
        const embed = new MessageEmbed()
        .setTitle(`**Setting Price**`)
        .setDescription('**Price Set Successfully : \`' + price + `\` \n For The Category: ${cat.toUpperCase()}**`)
        .setColor("RANDOM")
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()

        const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true})
        let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
        let logChannel = interaction.guild.channels.cache.get(log)
        if(!logChannel || log === null) return;
        let emb = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle(" Price Set")
        .setDescription(`لقد قام ${interaction.member.user.tag} بتحديد سعر القسم ${cat} بـ ${price}`)
        .setTimestamp()
        logChannel.send({embeds:[emb]})



    }
}