const { Client, Message, MessageEmbed } = require("discord.js");

const db = require('pro.db')
module.exports = {

    name: 'add',
    aliases: ['اضافة'],
    category:"info",
    description: 'Te',
    usage: '',
    run : async (client, message, args) => {	
      const {config} = client

        let category = args[0]
      if(!category) return message.reply("من فضلك قم بوضع نوع مثال للامر \n add <type> <accounts>")
        let data = await db.get(`accounts_${message.guild.id}_${client.user.id}`)
        if(!data || data === null) return message.reply({content: `:x:** No Categories Found **`});
        let check = data.find(x => x.name === category)

        if(!check) return message.reply({content: `:x:** Category Not Found **`});
      let admins = await db.get(`admins_${message.guild.id}_${client.user.id}`)
      if(!admins) {
        if(message.author.id !== config.ownerID && message.author.id !== check.recipent) return message.reply({content:`You Are Not The Bot Owner Or The Recipent` })

      } else {
        if(message.author.id !== config.ownerID && !admins.includes(message.author.id) && message.author.id !== check.recipent) return message.reply({content: `You Are Not An Admin`})
      }
      let s = args[1]
      if(!s) return message.reply("invalid command usage")
      let accs =message.content.split(" ").slice(2).join(" ").split("\n")
        if(!accs) return message.reply({content: `:x:** Invalid Format Example: add <type> <accounts>**`});
      if(!args[1].includes(":")) return message.reply("Accounts Must Be In This Format: email:pass")

        check.emails.push(...accs);
        db.set(`accounts_${message.guild.id}_${client.user.id}`, data);
        await message.reply(`:white_check_mark:** Accounts Added Successfully **`);

        let log = await db.get(`log_${message.guild.id}_${client.user.id}`)
        let logChannel = message.guild.channels.cache.get(log)
        if(!logChannel || log === null) return;
        let embed = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle("Accounts Added")
        .setDescription(`${message.author.username} Added ${accs.length} Accounts To ${category}`)
        .setTimestamp()
        logChannel.send({embeds:[embed]})













    }
}