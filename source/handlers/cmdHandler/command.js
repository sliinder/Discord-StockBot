const { readdirSync } = require("fs");

module.exports = client => {
  // Read every commands subfolder
  readdirSync(`./source/commands/`).forEach(dir => {
    // Filter so we only have .js command files
    const cmd = readdirSync(`./source/commands/${dir}/`).filter(file =>
      file.endsWith(".js")
    );

    // Loop over the commands, and add all of them to a collection
    // If there's no name found, prevent it from returning an error,
    for (let file of cmd) {
      let pull = require(`./../../commands/${dir}/${file}`)

      if (pull.name) {
        client.commands.set(pull.name, pull);
        console.log(file, " done ✅");
      } else {
        console.log(
          file,
          `❌: missing something`
        );
        continue;
      }

      // If there's an aliases key, read the aliases.
      if (pull.aliases && Array.isArray(pull.aliases))
        pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
    }
  });
};
