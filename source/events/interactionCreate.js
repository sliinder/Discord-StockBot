const client = require('../../main.js');
client.on("interactionCreate", async (interaction) => {
    if(!interaction.guild) return;

  // Slash Command Handling
    if (interaction.isCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.reply({ content: "An error has occured "  , ephemeral: true});

        const args = [];

        for (let option     of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args).catch(err => {
					if(!interaction.deferred) {
					interaction.reply({content: `There Was An Error Whille Running This Command` , ephemeral: true})
					console.log(err)
					} else {
											interaction.editReply({content: `There Was An Error Whille Running This Command` , ephemeral: true})
					console.log(err)
					}
				})
    }

    // Context Menu Handling
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
});
