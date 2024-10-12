const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("display")
    .setDescription("Shows the Accounts")
    .addStringOption(option => option.setName("category-name").setRequired(true).setDescription("The Category Name ")),
    run : async (client, interaction, args) => {
			if(interaction.member.id !== client.config.ownerID) return interaction.reply({content: `Missing Permissions` , ephemeral:true})
        let status = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(!status || status === null) return interaction.reply({content: `:x:** No Categories Found.**`, ephemeral: true});
        let category = interaction.options.getString("category-name");
        let cat = category ? category.toLowerCase() : null;
        if(cat && cat !== null) {
          
            let check = status.find(x => x.name === cat)
            if(check === undefined) return interaction.reply({content: `:x:** Category Not Found.**`, ephemeral: true});
					if(check.emails.length < 1) return interaction.reply({content: `No Accounts Found`})
					        let nextButton = new MessageButton()
        .setLabel(`➡️`)
        .setStyle("PRIMARY")
        .setCustomId("next")
        .setDisabled(false)
        let prevButton = new MessageButton()
        .setLabel(`⬅️`)
        .setStyle("PRIMARY")
        .setCustomId("prev")
        .setDisabled(true)
					        let row = new MessageActionRow()
        .addComponents(prevButton, nextButton)
					        const totalPages = Math.ceil(check.emails.length / 10) || 1
					let page = 0
           let accounts  = check.emails

					let mapped = accounts.slice(page * 10 , page * 10 + 10).map((acc , index) => {
						return `${index + 1} - ${acc}`
					}).join("\n")

					let embed = new MessageEmbed()
					.setTitle(`${check.name.toUpperCase()} Accounts`)
					.setDescription(`${mapped}`)
					.setFooter({text: `Page ${page + 1 }/${totalPages}`})
					  if(totalPages <= 1) {
            nextButton.setDisabled(true)
            prevButton.setDisabled(true)
        }

            const msg = await interaction.reply({embeds: [embed] , components: [row] ,fetchReply: true});
					            if(totalPages <= 1) return;
  const filter = i => i.user.id === interaction.member.id
            const collector = msg.createMessageComponentCollector({filter , time: 180000})

					 collector.on("collect" , async i => {
                await i.deferUpdate() 
                if(i.customId === "next") {
                    if(page === totalPages - 1) {
                        nextButton.setDisabled(true)
                        prevButton.setDisabled(false)
                        
                    } else {
                        nextButton.setDisabled(false)
                        prevButton.setDisabled(false)
                        page++
                        if(page === totalPages - 1) {
                            nextButton.setDisabled(true)
                            prevButton.setDisabled(false)
                        }
                    
                    }
                   					let mapped = accounts.slice(page * 10 , page * 10 + 10).map((acc , index) => {
						return `${page * 10 + index + 1} - ${acc}`
					}).join("\n")
                    embed.setDescription(`${mapped}`)
                    embed.setFooter({text: `Tech Official Development | Page ${page + 1}/${totalPages}`})

                    await i.editReply({embeds: [embed] , components: [row], fetchReply: true })


                } else if (i.customId === "prev") {
                    if(page === 0) {
                        prevButton.setDisabled(true)
                    } else {
                        page--
                        if(page < totalPages -1) {
                            nextButton.setDisabled(false)
                        }
                        if(page === 0) {
                            prevButton.setDisabled(true)
        
                        }
                    }
                    
                    					let mapped = accounts.slice(page * 10 , page * 10 + 10).map((acc , index) => {
						return `${page * 10 + index + 1} - ${acc}`
					}).join("\n")
                    embed.setDescription(` ${mapped}`)
                    embed.setFooter({text: `Tech Official Development | Page ${page + 1}/${totalPages}` })

                    await i.editReply({embeds: [embed] , components: [row], fetchReply: true })
                }

            })


        }
       

       
        







          


   



    }
}