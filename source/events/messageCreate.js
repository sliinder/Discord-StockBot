const client = require('../../main.js');
const config = require(`../../config.json`)
const db = require('pro.db')


client.on("messageCreate", async message => { 

    // Normal Commands Handling
    if (message.author.bot) return;
    if (!message.guild) return;

	let prefix = db.get(`prefix_${message.guild.id}_${client.user.id}`) || config.prefix;


    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await guild.fetchMember(message); 

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd); 
  if (!command) command = client.commands.get(client.aliases.get(cmd)); 
    if (command) 
        command.run(client, message, args); 


})
