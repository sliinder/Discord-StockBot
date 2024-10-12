
const { readdirSync } = require("fs");

module.exports = client => {
    // Filter so we only have .js event files
    const cmd = readdirSync(`./source/events/`).filter(file =>
      file.endsWith(".js")
    );
    // Loop over the events, and add all of them to a collection
    for (let file of cmd) {
        const getEvent = require(`../../events/${file}`)

        try {
            client.events.set(getEvent.name , getEvent)

        } catch (err) {
             return console.log(err)
        }

    }

}
