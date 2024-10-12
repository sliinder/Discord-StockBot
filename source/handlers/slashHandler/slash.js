const config = require("./../../../config.json")
const { readdirSync} = require("fs") 
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9");
const client = require("../../../main");

module.exports = async (client) => {
    let commands = [];

    readdirSync(`./source/SlashCommands/`).forEach(dir => {
        // Filter so we only have .js command files
        const cmd = readdirSync(`./source/SlashCommands/${dir}/`).filter(file =>
          file.endsWith(".js")
        );
        // Loop over the commands, and add all of them to a collection
        // If there's no name found, prevent it from returning an error,
        for (let file of cmd) {
          let pull = require(`./../../SlashCommands/${dir}/${file}`)
                        commands.push(pull.data.toJSON())
            client.slashCommands.set(pull.data.name, pull);
          } 

        
      });
      client.once("ready" , () => {
        const clientID = client.user.id
        const rest = new REST({
            version: 9
        }).setToken(client.token);
        (async () => {
            try{
                if(config.registerGlobal) {
                    await rest.put(Routes.applicationCommands(clientID) , {
                        body: commands
                    });
                    console.log(`Registered Commands For All Guilds`)
    
                } else {
                    await rest.put(Routes.applicationGuildCommands(clientID , config.mainGuildID), {
                        body: commands
                    });
                    console.log(`Registered Commands For The Main Guild`)
                }
            } catch (err) {
                if(err) console.log(err)
    
            }
        })();
    })

};
