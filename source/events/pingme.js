const client = require('../../main.js');

const config = require(`../../config.json`)
const db = require('pro.db')
const { MessageActionRow , MessageButton , MessageEmbed } = require('discord.js')
client.on('messageCreate' , async message => {
	if(!message.guild) return;
	if(message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;
	 if (message.content === `<@${client.user.id}>`) {
		const prefix =  db.get(`prefix_${message.guild.id}_${client.user.id}`) || config.prefix;
		const emb = new MessageEmbed()
		.setTitle(`${client.user.username}`)
		.setDescription(`You Pinged ${client.user.username }. However , My Prefix (${prefix})  .. Try ${prefix}help `)
		.setTimestamp()
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setLabel('! Just Development ✔️')
				.setStyle('PRIMARY')
				.setCustomId('Just')
				.setDisabled(false)
			)
			const row2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setLabel('! Just Development ✔️')
				.setStyle('PRIMARY')
				.setCustomId('Just')
				.setDisabled(true)
			)	
	const msg = await	message.reply({embeds: [emb] , components: [row]})

		const filter = i => i.user.id === message.author.id;

const collector = msg.createMessageComponentCollector({ filter, time: 9999 });

collector.on('collect', async i => {

		if (i.customId === 'Just') {
					await i.deferUpdate();
					return i.editReply({content: '*No thing in this button bro ;))*' , components: [row2]} )

		}
	})

	 }
		

})
