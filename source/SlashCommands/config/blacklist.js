const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Blacklist A user from using your bot")
			.addUserOption(option => option.setName("user").setRequired(true).setDescription(`mention the user`)),
	
    run : async (client, interaction, args) => {	
			let user = interaction.options.getUser("user");
			let admins = await db.get(`admins_${interaction.guild.id}_${client.user.id}`)
			if(!admins) {
				if(interaction.member.id !== client.config.ownerID) return interaction.reply({content:`You Are Not The Bot Owner` , ephemeral: true})
				
			} else {
				if(interaction.member.id !== client.config.ownerID && !admins.includes(interaction.member.id)) return interaction.reply({content: `You Are Not An Admin` , ephemeral: true})
			}

			let blacklist = await db.get(`blacklist_${interaction.guild.id}_${client.user.id}`)
if(!blacklist) {
db.set(`blacklist_${interaction.guild.id}_${client.user.id}` , [user.id])
	 interaction.reply({content: `Blacklisted The User..`})	
}	else if(blacklist.includes(user.id)) {
	return interaction.reply({content:`This Member Already In My Blacklist`})
	
}	 else {
	blacklist.push(user.id)
	await db.set(`blacklist_${interaction.guild.id}_${client.user.id}` , blacklist)
		 interaction.reply({content: `Blacklisted The User..`})	

	
}	

    
    
    
        








          


   



    }
}