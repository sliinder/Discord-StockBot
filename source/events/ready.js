const client = require('../../main.js');
const config = require(`../../config.json`)
const db = require('pro.db')
	client.on('ready' , async () => {
        const status = await db.get(`status_${client.user.id}`) || config.Activity;
		client.user.setActivity(`${status}` , {type:`${config.ActivityType}`})
		console.log(`${client.user.username} is Ready`)
		client.user.setStatus("idle")
	})