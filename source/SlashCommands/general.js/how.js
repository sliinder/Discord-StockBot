const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("how")
    .setDescription("How To Buy❓"),
    run : async (client, interaction, args) => {
        await interaction.reply({content: `https://media.discordapp.net/attachments/1249532480051089490/1265297116041969808/Record_2024-07-23-16-13-53.mp4?ex=66a0ff44&is=669fadc4&hm=7e8cc0507e74164ba6b0896ffc458cfb98ab5052d9eb7cb62d8758ebe918f810&`})
    }
  
}