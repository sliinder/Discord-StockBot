const { MessageEmbed , MessageActionRow , MessageSelectMenu, MessageButton} = require('discord.js');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('pro.db')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give Accounts From The Store")
    .addUserOption(option => option.setName("user").setRequired(true).setDescription("Mention Or Put The User ID"))
    .addStringOption(option => option.setName("amount").setRequired(false).setDescription("كمية الحسابات التي تريد اعطائها")),
    run : async (client, interaction, args) => {
    
        let admins = await db.get(`admins_${interaction.guild.id}_${client.user.id}`)
        if(!admins || admins === null) admins = [];
        if(client.config.ownerID !== interaction.member.id && !admins.includes(interaction.member.id)) return interaction.reply({content: `:x:**You Are Not The Bot Owner Or An Admin.**`, ephemeral: true});

        let user = interaction.options.getUser("user");

        let amount = interaction.options.getString("amount");
        if(!amount) amount = 1;
        let status = await db.get(`accounts_${interaction.guild.id}_${client.user.id}`)
        if(!status || status === null) return interaction.reply({content: `:x:** No Categories Found.**`, ephemeral: true});
        let menu = new MessageSelectMenu()
        .setCustomId("give")
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
        .setTitle(`**Give Accounts From The Store**`)
        .setDescription(`**Please Choose From The Menu The Account Type ..\n The Accounts Amount: \`${amount}\`**`)
        //.setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()

        const msg = await interaction.reply({embeds: [embed], components: [row, row2] , fetchReply: true});
        const filter = i => i.user.id === interaction.member.id;
        const collector = msg.createMessageComponentCollector({filter , time: 60000 });

        collector.on("collect", async (i) => {
            await i.deferUpdate();
            if(i.isSelectMenu()) {
                // making a loop in the status array to find the account type
                let accountType = i.values[0];
                let account = status.find(x => x.name === accountType);
                let errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`**ERROR Occured**`)
                

                if(!account) {
                    errorEmbed.setDescription(`**No Account Found With The Name: \`${accountType}\`**`)
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
                    await interaction.editReply({embeds: [errorEmbed] , components: []});
                    return;
                }
                
      
      
            // splice the accounts from the array then save the new array
          const accs = emails.splice(0, amount)
          status[status.indexOf(account)].emails = emails;
            await db.set(`accounts_${interaction.guild.id}_${client.user.id}`, status)
 
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
  const collectedMessage = await user.send({
    embeds: [new MessageEmbed()


      .setDescription(`**Hi** ${user.tag}, :shopping_cart: \`|\` **You Have Been Given Account${amount > 1 ? "s" : ""}**
\`\`\`
${accs.join("\n")}
\`\`\`

> **Account type:** ${accountName.toUpperCase()}
> **Amount of account${amount > 1 ? "s" : ""}:** \`${amount}\`
> **Given date:** <t:${Math.round(Date.now()  /1000)}:F>
`)
    .setColor("RED")
    ] , components: [phone]
  }).catch(err => {
    errorEmbed.setDescription(`**${user.username} DM Is Closed!!! .. Couldn't Send The Accounts**`)
     interaction.editReply({content: `.` , embeds: [errorEmbed] , components: []});


  })
    if(collectedMessage) {
        let feedback = await db.get(`feedback_${interaction.guild.id}_${client.user.id}`)
        let feedbackChannel = interaction.guild.channels.cache.find(x => x.name === feedback)



        try {
            msg.delete()
            
        } catch (error) {
            console.log(`Error Deleting Message: ${error}`)
            
        }
        if(feedbackChannel !== undefined) {

        interaction.followUp({ content: `**Check Your DM's & Don't Forget To Rate The Service ${feedbackChannel} <:True_accshop:984906465640849428>**`})

        //.setThumbnail(client.user.displayAvatarURL())
 
    } else {
        interaction.followUp({ content: `**Check Your DM's <:True_accshop:984906465640849428>**`})
     
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
        //.setTitle("Gived Accounts")
        .setDescription(`**:gift: \`|\` Done Given To \`${user.username}\` | \`(${user.id})\`** `)
                      //  
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
            name: "Given By",
            value: `${interaction.member} | \`${interaction.member.id}\`` 
        } , {
            name: "Give Date",
            value: `<t:${Math.round(Date.now()  /1000)}:F>`
        })
        ///.setTimestamp()
        logChannel.send({embeds:[emb]})
    }

    const filter2 = i => i.user.id === user.id
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
            }
            if(i.isButton()) {
                if(i.customId === "cancel") {
                    
                    let embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`**Cancelled**`)
                    .setDescription(`**You Have Cancelled The Give Process**`)
                    //.setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp()


                    return interaction.editReply({content: `.` , embeds: [embed] , components: []});

                }

            }
        })
        


        




       

       
        







          


   



    }
}