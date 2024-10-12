const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("stock")
    .setDescription("Shows the stock of the categories")
    .addStringOption(option => option.setName("category-name").setRequired(false).setDescription("The Category Name (Optional)")),
    run : async (client, interaction, args) => {
        let status = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(!status || status === null) return interaction.reply({content: `:x:** No Categories Found.**`, ephemeral: true});
        let category = interaction.options.getString("category-name");
        let cat = category ? category.toLowerCase() : null;
        if(cat && cat !== null) {
          
            let check = status.find(x => x.name === cat)
            if(check === undefined) return interaction.reply({content: `:x:** Category Not Found.**`, ephemeral: true});
            let embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`${category.toUpperCase()} Stock`)
            .setDescription(`**${check.description}**`)
            .addFields({
                name: "Price",
                value: `\`${check.price}\``,
                inline: true
    
            } , {
                name: "Stock",
                value: `\`${check.emails.length}\``,
                inline: true
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()

            return interaction.reply({embeds: [embed]});
        } else {
            // map all categories in status
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
           // ${i + 1}.      **- Description: ${x.description}** \n
            // map the categories 
            let mappedCategories = categories.map((x , i) => {
                return `**------[ ${x.name.toUpperCase()} ]------** 
>  **Price**: \`$${x.price}\` 
>  **Stock**: \`${x.emails.length}\`\n`
            }
            ) 
            let embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`**Accounts Stock :inbox_tray: **`)
            .setDescription(`${mappedCategories.join("\n")}`)
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()

            return interaction.reply({embeds: [embed]});

        }
       

       
        







          


   



    }
}