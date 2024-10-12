const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("remove-accounts")
    .setDescription("removes an account from a specific category")
    .addStringOption(option => option.setName("category-name").setRequired(true).setDescription("The Category Name"))
    .addStringOption(option => option.setName("account").setRequired(true).setDescription("(email:pass) or (all) delete all accounts")),
    run : async (client, interaction, args) => {	

        let category = interaction.options.getString("category-name").toLowerCase();
        
        let data = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(data === null) return interaction.reply({content: `:x:** No Categories Found **`, ephemeral: true});
        let check = data.find(x => x.name === category)

       
        if(check === undefined) return interaction.reply({content: `:x:** Category Not Found **`, ephemeral: true});
        let admins = await db.get(`admins_${interaction.guild.id}_${client.user.id}`)
        if(!admins || admins === null) {
            if(client.config.ownerID !== interaction.member.id && check.recipent !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});
        } else {
            if(client.config.ownerID !== interaction.member.id && !admins.includes(interaction.member.id) && check.recipent !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not An Admin.**`, ephemeral: true});
        }
        if(interaction.options.getString("account") === "all") {
            check.emails = [];
            db.set(`accounts_${interaction.guild.id}_${client.user.id}`, data);
            
            interaction.reply({content: `:white_check_mark:** All Accounts Deleted Successfully.**`, ephemeral: true});
            let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
            let logChannel = interaction.guild.channels.cache.get(log)
            if(!logChannel || log === null) return;
            let emb = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Accounts Deleted")
            .setDescription(`${interaction.member.user.tag} Deleted All Accounts From ${category}`)
            .setTimestamp()
            logChannel.send(emb)
        } else {
            if(!interaction.options.getString("account").includes(":")) return interaction.reply({content: `:x:** Invalid Format Example: /remove-account [${category}] [email:pass] **`, ephemeral: true});
            let account = interaction.options.getString("account")
            // checking if  check.emails contains the account
            if(!check.emails.includes(account)) return interaction.reply({content: `:x:** Account Not Found **`, ephemeral: true});
            // removing the account
            check.emails.splice(check.emails.indexOf(account), 1);
    
    
            db.set(`accounts_${interaction.guild.id}_${client.user.id}`, data);
            await interaction.reply({content: `:white_check_mark:** Account Removed Successfully **`, ephemeral: true});
            let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
            let logChannel = interaction.guild.channels.cache.get(log)
            if(!logChannel || log === null) return;
            let emb = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Deleted Account")
            .setDescription(`${interaction.member.user.tag} Deleted ${account} From ${category}`)
            .setTimestamp()
            logChannel.send({embeds:[emb]})
         
    
        }
        

    }
}