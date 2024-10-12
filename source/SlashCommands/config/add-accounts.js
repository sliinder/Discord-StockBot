const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("add-accounts")
    .setDescription("adds new accounts to a category")
    .addStringOption(option => option.setName("category-name").setRequired(true).setDescription("The Category Name"))
    .addStringOption(option => option.setName("accounts").setRequired(true).setDescription("email:pass please Read the help guide")),
    run : async (client, interaction, args) => {	

        let category = interaction.options.getString("category-name").toLowerCase();
        let data = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(!data || data === null) return interaction.reply({content: `:x:** No Categories Found **`, ephemeral: true});
        let check = data.find(x => x.name === category)

        if(check === undefined) return interaction.reply({content: `:x:** Category Not Found **`, ephemeral: true});
        if(client.config.ownerID !== interaction.member.id &&  check.recipent !== interaction.member.id) return interaction.reply({content: `:x:** You are not the owner of this bot || Category. **`, ephemeral: true});
        if(!interaction.options.getString("accounts").includes(":")) return interaction.reply({content: `:x:** Invalid Format Example: /add-accounts [${category}] [email1:pass1 email2:pass2 email3:pass3] **`, ephemeral: true});
        let accounts = interaction.options.getString("accounts").split(" ");
        if(accounts.length > 100000) return interaction.reply({content: `:x:** You Can Only Add 50 Accounts At Once **`, ephemeral: true});
        if(check.emails.length + accounts.length > 100000) return interaction.reply({content: `:x:** You Can Only Add 50 Accounts At Once  You Can Add: ${100000 - check.emails.length }**`, ephemeral: true});

        check.emails.push(...accounts);
        db.set(`accounts_${interaction.guild.id}_${client.user.id}`, data);
        await interaction.reply({content: `:white_check_mark:** Accounts Added Successfully **`, ephemeral: true});
     
        let buyChannel = await db.get(`buyChannel_${interaction.guild.id}_${client.user.id}`)
        let stockChannel = interaction.guild.channels.cache.get('981552580176019566')
        if(!stockChannel) return;
        let embed = new MessageEmbed()
        .setColor("#00ff00")
          .setTitle(`**${check.emoji ? check.emoji : `🛒`} New ${category.toUpperCase()} accounts added!**`)
.addFields({name: `Price:` , value: `$${check.price - 1}` , inline: true},{name: `Buying Channel:` , value: `<#${buyChannel}>` , inline: true})
        .setDescription(`**${check.emails.length}** ${category} accounts has been added to the bot! 🎊`)
        .setTimestamp()
					 
stockChannel.send({content: `<@&993186278059294800>` , embeds: [embed]})
			stockChannel.send({content: `https://i.ibb.co/N1JMLZF/683799239717027888.gif`})




    }
}