const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("See All Settings For Your Bot"),
    run : async (client, interaction, args) => {	

        let admin = await db.get(`admins_${interaction.guild.id}_${client.user.id}`)
        if(!admin|| admin === null) {
            if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});
        } else {
            if(client.config.ownerID !== interaction.member.id && !admin.includes(interaction.member.id)) return interaction.reply({content: `:x:**You Are Not An Admin.**`, ephemeral: true});
        }

        let status = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        let customerRole = await db.get(`role_${interaction.guild.id}_${client.user.id}`)
        let buyChannel = await db.get(`buyChannel_${interaction.guild.id}_${client.user.id}`)
        let logChannel = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
        let probotID = await db.get(`probotID_${interaction.guild.id}_${client.user.id}`)
        let store = await db.get(`store_${interaction.guild.id}_${client.user.id}`)
        let admins = await db.get(`admins_${interaction.guild.id}_${client.user.id}`)
        let prefix = await db.get(`prefix_${interaction.guild.id}_${client.user.id}`)
        if(!status) status = "No Categories Found"
        let feedbackChannel = interaction.guild.channels.cache.find(x => x.id === feedback)
        if(!feedbackChannel) feedbackChannel = "No Feedback Found"
        let role = interaction.guild.roles.cache.find(x => x.id === customerRole)
        if(!role) role = "No Role Found"
        let channel = interaction.guild.channels.cache.find(x => x.id === buyChannel)
        if(!channel) channel = "No Buy Channel Found"
        let log = interaction.guild.channels.cache.find(x => x.id === logChannel)
        if(!log) log = "No Log Channel Found"
        let probot = interaction.guild.members.cache.find(x => x.id === probotID)
        if(!probot) probot = "282859044593598464"
        if(!store) store = "Closed"
        if(!admins) admins = "No Admins Yet"
        if(!prefix) prefix = client.config.prefix

        // get the categories in the status 
        let categories = []
        status.forEach(x => {
            categories.push({
                name: x.name,
                description: x.description,
                price: x.price,
                recipent: x.recipent,
                emails: x.emails,
            })
        })

        // map the categories 
        let mappedCategories = categories.map((x , i) => {
            return `**${i + 1}.${x.name}** \n -${x.description} \n Price:\`${x.price}\` - متلقي الكريدت ID :${x.recipent} - Stock:\`${x.emails.length}\``
        }
        ) 

        // map the admins 
			let mappedAdmins;
        if(admins !== "No Admins Yet") {
             mappedAdmins = admins.map((x , i) => {
                return `${i + 1}- ID: ${x}`
            })
        }
        

        let embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Config Settings For The Bot")
        .addFields({
            name: "Store Status",
            value: `${store}`,
            inline: true,


        } , {
            name: "Prefix",
            value: `${prefix}`,
            inline: true,

        } , {
            name: "Categories Information",
            value: `${mappedCategories.join("\n")}`
        } , 
           {
            name: "Buy Channel",
            value: `${channel}`
        } , {
            name: "Log Channel",
            value: `${log}`
        } , {
            name: "Probot ID",
            value: `${probot}`
        })
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        if(admins !== "No Admins Yet") {
            embed.addFields({
                name: "Admins",
                value: `${mappedAdmins.join("\n")}`
            }
            )
        } else {
            embed.addFields({
                name: "Admins",
                value: `${admins}`
            }
            )

        }


        return interaction.reply({embeds: [embed]})






          


   



    }
}