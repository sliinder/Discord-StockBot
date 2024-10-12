const { Client, Message, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-proof")
    .setDescription("Set A proof Channel For Your Bot")
    .addChannelOption(option => option.setName("proof-channel").setRequired(true).setDescription("Mention The proof Channel (it must be hidden from members)")),
    run : async (client, interaction, args) => {	
        if(client.config.ownerID !== interaction.member.id) return interaction.reply({content: `:x:**You Are Not The Bot Owner.**`, ephemeral: true});

        let proofChannel = interaction.options.getChannel("proof-channel");
        let proofChannelID = proofChannel.id;
        if(proofChannel.type !== "GUILD_TEXT") return interaction.reply({content: `:x:** Invalid Channel.**`, ephemeral: true});
        if(proofChannelID === null) return interaction.reply({content: `:x:** Invalid Channel.**`, ephemeral: true});

        let proof = await db.get(`proof_${interaction.guild.id}_${client.user.id}`)
        if(proof === null) {

            await db.set(`proof_${interaction.guild.id}_${client.user.id}`, proofChannelID);
            const embed = new MessageEmbed()
            .setTitle(`**proof Channel**`)
            .setDescription('proof Channel Changed Successfully To: ' + `${proofChannel}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("proof Channel Set")
      .setDescription(`proof Feature Set Successfully < Here You Will See All Your Bot's proofs >`)
      .setTimestamp()
      proofChannel.send({embeds:[emb]})
        } else if(proof === proofChannelID) {
            return interaction.reply({content: `:x:** proof Channel Is Already ${proofChannel} **`, ephemeral: true});
        } else {
            await db.set(`proof_${interaction.guild.id}_${client.user.id}`, proofChannelID);
            const embed = new MessageEmbed()
            .setTitle(`**proof Channel**`)
            .setDescription('proof Channel Changed Successfully To: ' + `${proofChannel}`)
            .setColor('#0099ff')
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
    
    
    
      const msg =   await interaction.reply({embeds: [embed] , components: [] , fetchReply: true});
      let emb = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("proof Channel Set")
      .setDescription(`proof Feature Set Successfully < Here You Will See All Your Bot's proofs >`)
      .setTimestamp()
      proofChannel.send({embeds:[emb]})
      
        }
    
    
    
        








          


   



    }
}