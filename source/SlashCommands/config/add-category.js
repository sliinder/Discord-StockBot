const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("add-category")
    .setDescription("adds a new category to the store")
    .addStringOption(option => option.setName("category-name").setRequired(true).setDescription("The New Category Name"))
    .addStringOption(option => option.setName("category-description").setRequired(true).setDescription("The New Category Description")),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});
        let newCategory = interaction.options.getString("category-name").toLowerCase();
        let catDesc = interaction.options.getString("category-description");
        let status = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(!status || status === null) {
            let data = {
                name: newCategory,
                description: catDesc,
                recipent: `${interaction.member.id}`,
                price: 0,
                tax: 0,
                emails: [],
            }
            await db.set(`accounts_${interaction.guild.id}_${client.user.id}`, [data]); 
            const embed = new MessageEmbed()
            .setTitle(`**Adding Category**`)
            .setDescription('Category Added Successfully : ' + newCategory)
            .setColor("RANDOM")
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
            let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
            let logChannel = interaction.guild.channels.cache.get(log)
            if(!logChannel || log === null) return;
            let emb = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("New Category Added")
            .setDescription(`${interaction.member.user.tag} Added ${newCategory} As A New Category`)
            .setTimestamp()
            logChannel.send({embeds:[emb]})
        } else{
            if(status.length === 50) return interaction.reply({content: `:x:** You Have Reached The Maximum Number Of Categories.**`, ephemeral: true}); 
            
            let check = status.find(x => x.name === newCategory)
            
            if(check !== undefined) return interaction.reply({content: `:x:** Category Already Exists **`, ephemeral: true});
            let data = {
                name: newCategory,
                description: catDesc,
                recipent: `${interaction.member.id}`,
                price: 0,
                tax: 0,
                emails: [],
            }
            await status.push(data);
            await db.set(`accounts_${interaction.guild.id}_${client.user.id}`, status); 
            const embed = new MessageEmbed()
            .setTitle(`**Adding Category**`)
            .setDescription('Category Added Successfully :' + newCategory)
            .setColor("RANDOM")
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
            let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
            let logChannel = interaction.guild.channels.cache.get(log)
            if(!logChannel || log === null) return;
            let emb = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("New Category Added")
            .setDescription(`${interaction.member.user.tag} Added ${newCategory} As A New Category`)
            .setTimestamp()
            logChannel.send({embeds:[emb]})
        }


     







          


   



    }
}