const client = require('../../main.js');
const config = require(`../../config.json`)
const db = require('pro.db')

const {MessageEmbed , MessageButton , MessageActionRow} = require("discord.js")
client.on("messageCreate", async message => { 

    // Normal Commands Handling
    if (message.author.bot) return;
    if (!message.guild) return;
	if(message.content.startsWith("!buy")) {
		const embed = new MessageEmbed()
		.setDescription(`This Command Has Moved To Slash Commands.. Try **/buy** Instead`)
		.setColor(message.guild.me.displayHexColor)
		const button = new MessageButton()
		.setLabel(`More Info`)
		.setURL("https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ")
		.setStyle("LINK")
			const m = new MessageActionRow()
		.addComponents(button)
		message.reply({embeds:[embed] , components: [m]})
		
		
	}
	if(message.content.startsWith("!stock")) {
		const embed = new MessageEmbed()
		.setDescription(`This Command Has Moved To Slash Commands.. Try **/stock** Instead`)
		.setColor(message.guild.me.displayHexColor)
		const button = new MessageButton()
		.setLabel(`More Info`)
		.setURL("https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ")
		.setStyle("LINK")
			const m = new MessageActionRow()
		.addComponents(button)
		message.reply({embeds:[embed] , components: [m]})
		
		
	}

})
