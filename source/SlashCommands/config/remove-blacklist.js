const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("remove-blacklist")
    .setDescription("Remove The Blacklist from A user to use your bot")
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
    return	 interaction.reply({content: `There Is No Blacklist..`})	
}	else if(!blacklist.includes(user.id)) {
	return interaction.reply({content:`This Member Is not Already In My Blacklist`})
	
}	 else {
                    let index = blacklist.indexOf(user.id)
                    blacklist.splice(index, 1)
	await db.set(`blacklist_${interaction.guild.id}_${client.user.id}` , blacklist)
		 interaction.reply({content: `Removed The Blacklist From The User..`})	

	
}	




    }
}