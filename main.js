const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const db = require('pro.db');
require('dotenv').config();

const data = require("./config.json");

let client = new Client({ 
partials: ["MESSAGE", "CHANNEL", "REACTION"], 
repliedUser: true, 
intents: [
Intents.FLAGS.GUILDS, 
Intents.FLAGS.GUILD_MEMBERS, 
Intents.FLAGS.GUILD_BANS, 
Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
Intents.FLAGS.GUILD_INTEGRATIONS, 
Intents.FLAGS.GUILD_WEBHOOKS, 
Intents.FLAGS.GUILD_INVITES, 
Intents.FLAGS.GUILD_VOICE_STATES, 
Intents.FLAGS.GUILD_PRESENCES, 
Intents.FLAGS.GUILD_MESSAGES, 
Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
Intents.FLAGS.GUILD_MESSAGE_TYPING, 
Intents.FLAGS.DIRECT_MESSAGES, 
Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, 
Intents.FLAGS.DIRECT_MESSAGE_TYPING
] 
});
module.exports = client;

client.config = data;
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
client.queue = new Map();

client.on('ready', async () => {
console.log(`Logged in as ${client.user.tag}`);
const fetchs = await db.fetchAll();

for (let i in fetchs) {
if (i.startsWith("buying_")) {
db.delete(i);
}
}
});

const custom = {
command() {
console.log("This is my command.");
},
};

// تحميل الهاندلر
require(`./source/handlers/cmdHandler/command.js`)(client);
require(`./source/handlers/slashHandler/slash.js`)(client);
require(`./source/handlers/eventHandler/events.js`)(client);

process.on('unhandledRejection', error => {
console.error('Unhandled promise rejection:', error);
});
process.on('typeError', error => {
console.error('Unhandled type rejection:', error);
});

client.login(process.env.token).catch(console.error);
