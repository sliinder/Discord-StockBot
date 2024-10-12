const { MessageEmbed , MessageActionRow , MessageSelectMenu, MessageButton} = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy Accounts From The Store")
    .addNumberOption(option => option.setName("amount").setRequired(false).setDescription("كمية الحسابات التي تريد شرائها")),
    run : async (client, interaction, args) => {
       let accs = [];
			let accountType = undefined;
			if(db.has(`buying_${interaction.guild.id}_${interaction.member.id}`)) return interaction.reply({content: `:x:**You Already Have A Buying Process.**`, ephemeral: true});

			let blacklist = await db.get(`blacklist_${interaction.guild.id}_${client.user.id}`)
			if(blacklist && blacklist.includes(interaction.member.id)) {
				return interaction.reply({content: `You Are Black Listed!` , ephemeral:true})
			}


    let buyChannel  = await db.get(`buyChannel_${interaction.guild.id}_${client.user.id}`)
    if(buyChannel && interaction.channel.id !== buyChannel)  return interaction.reply({content: `:x:** You Must Be In The <#${buyChannel}> To Buy.**`, ephemeral: true});

        let amount = interaction.options.getNumber("amount");
        if(!amount) amount = 1;
			    if(isNaN(amount)) return interaction.reply({content: `Right Usage is buy [amount]`})
        if(amount < 1) return interaction.reply({content:`Amount Cann't Be Negative`})
        let store = await db.get(`store_${interaction.guild.id}_${client.user.id}`)
        if(!store || store === "close") return interaction.reply({content: `:x:** The Store Is Closed.**`, ephemeral: true});
        let status = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(!status || status === null) return interaction.reply({content: `:x:** No Categories Found.**`, ephemeral: true});
        let probotID = await db.get(`probotID_${interaction.guild.id}_${client.user.id}`) || "1032367534126678096";
        await db.set(`buying_${interaction.guild.id}_${interaction.member.id}`, true)

        let menu = new MessageSelectMenu()
        .setCustomId("buy")
        .setPlaceholder("Select The Account Type")
        .setMinValues(1)
        .setMaxValues(1)
        status.forEach(x => {
            menu.addOptions([
                {
                    label: `${x.name.toUpperCase()}`,
                    value: x.name,
                    description: `${x.description}`,
                    emoji: `${x.emoji ? x.emoji : `🛒`}`,
                }
            ])
        })
        let cancel = new MessageButton()
        .setLabel("Cancel The Operation")
        .setStyle("DANGER")
        .setDisabled(false)
        .setCustomId("cancel")


        const row = new MessageActionRow()
        .addComponents(
            menu
        )
        const row2 = new MessageActionRow()
        .addComponents(cancel)

        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`**Buy Accounts From The Store**`)
        .setDescription(`**Please Choose From The Menu The Account Type ..\n The Accounts Amount: \`${amount}\`**`)
        //.setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
			let cancelled = false

        const msg = await interaction.reply({embeds: [embed], components: [row, row2] , fetchReply: true});

			setTimeout(() => {
				if(db.has(`buying_${interaction.guild.id}_${interaction.member.id}`)) {
					db.delete(`buying_${interaction.guild.id}_${interaction.member.id}`)
				}
				
			} , 100000)
        const filter = i => i.user.id === interaction.member.id;
        const collector = msg.createMessageComponentCollector({filter , time: 60000 });

        collector.on("collect", async (i) => {
            await i.deferUpdate();
            if(i.isSelectMenu()) {
                // making a loop in the status array to find the account type
                 accountType = i.values[0];
                let account = status.find(x => x.name === accountType);
                let errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`**ERROR Occured**`)
                

                if(!account) {
                    errorEmbed.setDescription(`**No Account Found With The Name: \`${accountType}\`**`)
if(db.has(`buying_${interaction.guild.id}_${interaction.member.id}`)) {
	 db.delete(`buying_${interaction.guild.id}_${interaction.member.id}`)
 }  

                    await interaction.editReply({embeds: [errorEmbed] , components: []});
                    return;
                }
                let accPrice = account.price;
                if(accPrice === 0) {
                    errorEmbed.setDescription(`**The Price Of This Account Isn't Valid Please contact The Bot Admins.**`)
                    if(db.has(`buying_${interaction.guild.id}_${interaction.member.id}`)) {
	 db.delete(`buying_${interaction.guild.id}_${interaction.member.id}`)
 }  

                    await interaction.editReply({embeds: [errorEmbed] , components: []});
                    return;
                } 
                let accountName = account.name;

                let tax = account.tax;
                let finalPrice = tax * amount
                let recipentID = account.recipent
                let emails = account.emails
                if(emails.length < amount) {
                    errorEmbed.setDescription(`**The Amount Of Current Accounts In ${accountName.toUpperCase()} Is Less Than The Amount You Want To Buy.**`)
                    db.delete(`buying_${interaction.guild.id}_${interaction.member.id}`)

                    await interaction.editReply({embeds: [errorEmbed] , components: []});
                    return;
                }
							 accs = []
							for(let i = 0; i < amount; i++) {
								let randomAcc = Math.floor(Math.random() * emails.length)
								accs.push(emails[randomAcc])
								emails.splice(randomAcc , 1)
								
							}
                        await db.set(`accounts_${interaction.guild.id}_${client.user.id}`, status)
							
                let buy = new MessageEmbed()
                .addField(`**You Will Purchase ${accountName.toUpperCase()} accounts :**`
                  ,
      `
      - Accounts Amount: \`${amount}\`
      - Total price : ${finalPrice}  
      - You have 1 Minute to transfer
      - Please Keep Your DM's Open
      
        **:pencil: \`|\` Please Transfer \`$${finalPrice}\` Credits to <@${recipentID}>**\`\`\`#credit <@${recipentID}> ${finalPrice}\`\`\``)
        
                .setColor("RANDOM");                
      +
        
      
              interaction.editReply({ content: `#credit ${recipentID} ${finalPrice}` , embeds: [buy]  , components: [row2]})

  const filter = ({ content, author: { id } }) => {
  
            return content.startsWith(
              `**:moneybag: | ${interaction.member.user.username}, has transferred `
            ) &&
              content.includes(`${recipentID}`) &&
              id === probotID &&
              (Number(content.slice(content.lastIndexOf("`") - String(finalPrice).length, content.lastIndexOf("`"))) >= accPrice * amount);
          }
          msg.channel.awaitMessages({
            filter,
            max: 1,
            time: 60000,
            errors: ["time"]
          }).then(async message => {
            // splice the accounts from the array then save the new array
						console.log('cancelled?')
											while(cancelled) {return};
	console.log('not cancelled')
      
 
            let button = new MessageButton()
            .setLabel("For Phones")
            .setCustomId('acc')
            .setDisabled(false)
            .setStyle("SUCCESS")
            .setEmoji("📱")
            
            let phone = new MessageActionRow() 
  .addComponents(
      button
  )  
  const collectedMessage = await interaction.member.send({
    embeds: [new MessageEmbed()


      .setDescription(`**Hi** ${interaction.member.user.tag}, :shopping_cart: \`|\` **You Have Purchased Account${amount > 1 ? "s" : ""}**
\`\`\`
${accs.join("\n")}
\`\`\`

> **Account type:** ${accountName.toUpperCase()}
> **Amount of account${amount > 1 ? "s" : ""}:** \`${amount}\`
> **Total price:** \`${finalPrice}\`
> **Purchase date:** <t:${Math.round(Date.now()  /1000)}:F>
`)
    .setColor("GREEN")
    ] , components: [phone]
  }).catch(async err => {
    errorEmbed.setDescription(`**Your DM Is Closed!!! .. Couldn't Send The Accounts**`)
			const data = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
let check = data.find(x => x.name === accountType.toLowerCase())
// pushing accs array to check.emails
data[data.indexOf(check)].emails.push(...accs)
await db.set(`accounts_${interaction.guild.id}_${client.user.id}` , data)
     interaction.editReply({content: `.` , embeds: [errorEmbed] , components: []});
     if(db.has(`buying_${interaction.guild.id}_${interaction.member.id}`)) {
	 db.delete(`buying_${interaction.guild.id}_${interaction.member.id}`)
 }  


  })
    if(collectedMessage) {
        let feedback = await db.get(`feedback_${interaction.guild.id}_${client.user.id}`)
        let feedbackChannel = interaction.guild.channels.cache.find(x => x.id === feedback)
if(db.has(`buying_${interaction.guild.id}_${interaction.member.id}`)) {
	 db.delete(`buying_${interaction.guild.id}_${interaction.member.id}`)
 }  


        try {
            msg.delete()
            
        } catch (error) {
            console.log(`Error Deleting Message: ${error}`)
            
        }
        if(feedbackChannel) {

              interaction.followUp({content: `**Check Your DM's & Don't Forget To Rate The Service **`  , components: []})
    } else {
        interaction.followUp({content:`**Check Your DM's**`})
				}
    let roleID = await db.get(`role_${interaction.guild.id}_${client.user.id}`)
    let role = interaction.guild.roles.cache.find(x => x.id === roleID)
    if(role) {
        interaction.member.roles.add(role).catch(err => {
            console.log(`error adding the role ${err}`)})
    }
      
    let log = await db.get(`log_${interaction.guild.id}_${client.user.id}`)
    let logChannel = interaction.guild.channels.cache.get(log)
    if(logChannel && log !== null) {
        let emb = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle("Bought Accounts")
                .setDescription(`**:shopping_cart: \`|\` \`${interaction.member.user.tag}\` \`(${interaction.member.id})\` I have bought**`)
        .addFields({
            name: "Accounts",
            value: `||${accs.join("\n")}||`
        } , {
            name: "Category",
            value: `${accountName.toUpperCase()}`
        } , {
            name: `Amount Of ${amount > 1 ? "Accounts" : "Account"}`,
            value: `${amount} ${amount > 1 ? "Accounts" : "Account"}`
        } , {
            name: "Total Price",
            value: `${accPrice * amount}`
        } , {
            name: "Purchase Date",
            value: `<t:${Math.round(Date.now()  /1000)}:F>`
        })
        ///.setTimestamp()
        logChannel.send({embeds:[emb]})
    }
  
    const filter2 = i => i.user.id === interaction.member.id
    const collector2 = collectedMessage.createMessageComponentCollector({filter2 , time: 120000})
    collector2.on('collect', async i => {
        await i.deferUpdate();
        if(i.customId === "acc") {
            button.setDisabled(true)
            collectedMessage.edit({content: `||${accs.join("\n")}||` , components: [phone]})
        }
    })
    collector2.on('end', async (reason , collected) => {
        if(reason === "time" && collected.size === 0) {
                        button.setDisabled(true)
            collectedMessage.edit({ components: [phone]})
        }
    })

    

    
    }     
}).catch(async err => {
   if(!cancelled) {
		 if(db.has(`buying_${interaction.guild.id}_${interaction.member.id}`)) {
	 db.delete(`buying_${interaction.guild.id}_${interaction.member.id}`)
						const data = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
let check = data.find(x => x.name === accountType.toLowerCase())
// pushing accs array to check.emails
data[data.indexOf(check)].emails.push(...accs)
await db.set(`accounts_${interaction.guild.id}_${client.user.id}` , data)   
	
			errorEmbed.setDescription(`**Time Ended.**`)
    interaction.editReply({content: `.` , embeds: [errorEmbed] , components: []});
 }
	 }   

})
              

            }
            if(i.isButton()) {
                if(i.customId === "cancel") {
                    
 if(db.has(`buying_${interaction.guild.id}_${interaction.member.id}`)) {
	 db.delete(`buying_${interaction.guild.id}_${interaction.member.id}`)
	 
 }                   
									cancelled = true
                    let embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`**Cancelled**`)
                    .setDescription(`**You Have Cancelled The Purchase**`)
                    //.setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp()
if(accountType) {
	const data = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
let check = data.find(x => x.name === accountType.toLowerCase())

data[data.indexOf(check)].emails.push(...accs)
await db.set(`accounts_${interaction.guild.id}_${client.user.id}` , data)   
}
 						
                    return interaction.editReply({content: `.` , embeds: [embed] , components: []});

                }

            }
        })
        


        




       

       
        







          


   



    }
}