const { MessageEmbed , MessageActionRow , MessageSelectMenu, MessageButton} = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("See all the commands"),
    run : async (client, interaction, args) => {

        let admins = await db.get(`admins_${interaction.guild.id}_${client.user.id}`)
        if(!admins || admins === null) admins = [];
        let store = await db.get(`store_${interaction.guild.id}_${client.user.id}`)
        if(!store || store === "close") store = "closed"
        let menu = new MessageSelectMenu()
        .setCustomId("help")
        .setPlaceholder("Select From The Menu")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
            {
                label: `General Commands`,
                value: "general",
                description: `الاوامر العامة`,
                emoji: `🛒`

            } , {
                label: `Admin Commands`,
                value: "admin",
                description: `الاوامر الادارية`,
                emoji: `👮`
            } 
        ])
        let general = new MessageSelectMenu()
        .setCustomId("helps")
        .setPlaceholder("General Commands")
        .setMinValues(1)
        .setMaxValues(1)
        .setDisabled(true)
        .addOptions([
            {
                label: `General Commands`,
                value: "general",
                description: `الاوامر العامة`,
                emoji: `🛒`

            }
        ])
        let prefix = await db.get(`prefix_${interaction.guild.id}_${client.user.id}`) || client.config.prefix

        let next = new MessageButton()
        .setLabel("Next")
        .setStyle("PRIMARY")
        .setDisabled(false)
        .setCustomId("next")
        
        let previous = new MessageButton()
        .setLabel("Previous")
        .setStyle("PRIMARY")
        .setDisabled(false)
        .setCustomId("previous")

        const row = new MessageActionRow()
        .addComponents(
            menu
        )  
        const generalRow = new MessageActionRow()
        .addComponents(
            general
        )
            const buttonRow = new MessageActionRow()
        .addComponents(
            previous,next
        )

        const generalembed = new MessageEmbed()
        .setTitle("General Commands")
        .setDescription("**Here You Will See All The Commands**")
        .addFields({
            name: `**Store Stauts**`,
            value: `**${store}**`,
        } , {
            name: `**Current Prefix **`,
            value: `**${prefix} Or You Can Use Slash Commands**`,
        },{
            name: `**Buy Command**`,
            value: `**buy [amount]**`,
            inline: true,
        } , {
            name: `**Stock Command**`,
            value: `**stock**`,
            inline: true,

        } , {
            name: `**Help Command**`,
            value: `**help**`,
            inline: true,

        })
        .setThumbnail(interaction.member.user.displayAvatarURL({format : "png", dynamic: true}))
        .setFooter({text: `Slinder Development` , iconURL: client.user.displayAvatarURL()})
        .setColor("0099ff")

        let adminembed1 = new MessageEmbed()
        .setTitle("Admin Commands")
        .setDescription("**Here You Will See All The Bot Config Commands \n Some Commands Only The Bot Owner Can Use**")
        .addFields({
            name: `add-category`,
            value: `**adds New Account Type To The Database**`,

        } , {
            name: `delete-category`,
            value: `**Deletes An Account Type From The Database**`,
        } , {
            name: `add-accounts`,
            value: `**Adds Accounts To A Specific Category To The Database**`,
        } , {
            name: `remove-accounts`,
            value: `**Removes Accounts From A Specific Category From The Database**`,
        } , {
            name: `add-admin`,
            value: `**Adds A User To The Admin List Who Can Use the bot**`,
        } , {
            name: `remove-admin`,
            value: `**Removes A User From The Admin List Who Can Use the bot**`,
        })
        .setThumbnail(interaction.member.user.displayAvatarURL({format : "png", dynamic: true}))
        .setFooter({text: `JustYousef Development` , iconURL: client.user.displayAvatarURL()})
        .setColor("0099ff")

        let adminembed2 = new MessageEmbed()
        .setTitle("Admin Commands")
        .setDescription("**Here You Will See All The Bot Config Commands \n Some Commands Only The Bot Owner Can Use**")
        .addFields({
            name: `set-buy`,
            value: `**Sets The Buy Channel**`,
    
        } , {
            name: `set-log`,
            value: `**Sets The Log Channel**`,
        } , {
            name: `set-probot`,
            value: `**Sets The ProBot ID**`,
        } , {
            name: `set-recipent`,
            value: `**Sets The Recipent ID (الشخص اللى بيتلقى الكريدت من التحويل)**`,
        } , {
            name: `store`,
            value: `**Sets The Store Status (open / close)**`,
        } )
        .setThumbnail(interaction.member.user.displayAvatarURL({format : "png", dynamic: true}))
        .setFooter({text: `JustYousef Development` , iconURL: client.user.displayAvatarURL()})
        .setColor("0099ff")

        let adminembed3 = new MessageEmbed()
        .setTitle("Admin Commands")
        .setDescription("**Here You Will See All The Bot Config Commands \n Some Commands Only The Bot Owner Can Use**")
        .addFields({
            name: `disable-buy`,
            value: `**Disable The Buy Channel Feature**`,
        } , {
            name: `disable-role`,
            value: `**Disable The Role Feature**`,
        } , {
            name: `disable-log`,
            value: `**Disable The Log Channel Feature**`,
        })
        .setThumbnail(interaction.member.user.displayAvatarURL({format : "png", dynamic: true}))
        .setFooter({text: `JustYousef Development` , iconURL: client.user.displayAvatarURL()})
        .setColor("0099ff")

        let adminembed4 = new MessageEmbed()
        .setTitle("Admin Commands")
        .setDescription("**Here You Will See All The Bot Config Commands \n Some Commands Only The Bot Owner Can Use**")
        .addFields({
            name: `config`,
            value: `**Show Bot Settings All**`,
        } , {
            name: `set-price`,
            value: `**Sets The Price Of An Category**`,
        } , {
            name: `set-name`,
            value: `**Sets The Name Of The Bot**`,
        } , {
            name: `set-prefix`,
            value: `**Sets The Prefix Of The Bot**`,
        } , {
            name: `set-avatar`,
            value: `**Sets The Avatar Of The Bot**`,
        } , {
            name: `set-status`,
            value: `**Sets The Status Of The Bot**`,
        })
        .setThumbnail(interaction.member.user.displayAvatarURL({format : "png", dynamic: true}))
        .setFooter({text: `SLinder Development` , iconURL: client.user.displayAvatarURL()})
        .setColor("0099ff")



let currentPage = 1;

if(!interaction.member.permissions.has("ADMINISTRATOR") && client.config.ownerID !== interaction.member.id && !admins.includes(interaction.member.id)) {
        await interaction.reply({embeds: [generalembed], components: [generalRow] , fetchReply: true});
} else {
    const msg = await interaction.reply({embeds: [generalembed], components: [row] , fetchReply: true});
        const filter = i => i.user.id === interaction.member.id;
        const collector = msg.createMessageComponentCollector({filter , time: 60000 });

        collector.on("collect", async (i) => {
            await i.deferUpdate();
            if(i.isSelectMenu()) {
                if(i.values[0] === "general") {
                    await msg.edit({embeds: [generalembed], components: [generalRow] , fetchReply: true});
                } else if(i.values[0] === "admin") {
                    currentPage = 1;
                
                    await msg.edit({embeds: [adminembed1], components: [row , buttonRow] , fetchReply: true});
                }
            }
            if(i.isButton()) {
                if(i.customId === "next") {
                    currentPage++;
                    if(currentPage === 2) {
                        next.setDisabled(false)
                        previous.setDisabled(false)
                        await msg.edit({embeds: [adminembed2], components: [row , buttonRow] , fetchReply: true});
                    } else if (currentPage === 3) {
                        next.setDisabled(false)
                        previous.setDisabled(false)
                        await msg.edit({embeds: [adminembed3], components: [row , buttonRow] , fetchReply: true});
                    } else if (currentPage === 4) {
                        next.setDisabled(true);
                        previous.setDisabled(false)
                        await msg.edit({embeds: [adminembed4], components: [row , buttonRow] , fetchReply: true});
                    }
                } else if (i.customId === "previous") {
                    currentPage--;
                    if(currentPage === 1) {
                        previous.setDisabled(true); 
                        next.setDisabled(false)
                        await msg.edit({embeds: [adminembed1], components: [row , buttonRow] , fetchReply: true});
                    } else if (currentPage === 2) {
                        previous.setDisabled(false);
                        next.setDisabled(false)
                        await msg.edit({embeds: [adminembed2], components: [row , buttonRow] , fetchReply: true});
                    } else if (currentPage === 3) {
                        previous.setDisabled(false);
                        next.setDisabled(false)
                        await msg.edit({embeds: [adminembed3], components: [row , buttonRow] , fetchReply: true});
                    } 
                }
            }
        })

        collector.on("end", async (collected, reason) => {
            if(reason === "time") {
                await msg.edit({content: `Time Ended .. Re Use The Command Again`, components: [] , fetchReply: true});
            }
        })
        

    }
    }
}