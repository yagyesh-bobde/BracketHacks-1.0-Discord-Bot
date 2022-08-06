import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits, IntentsBitField } from "discord.js";
import dotenv from 'dotenv'
import path from 'path'
import getTranscription from './transcripy.js'

process.setMaxListeners(5)
dotenv.config()

let transcript = ''

const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageTyping
    ]
})

client.on('ready', () => {
    console.log(client.user.tag)

})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // get the file's URL 
    if (message.attachments.size === 0) { // Attachments are not present.
         message.channel.send('Instead of a text, attach an audio file please!')
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('BracketHacks 1.0')
                    .setURL('https://brackethacks-1.devpost.com')
                    .setStyle(ButtonStyle.Link),
            );

        message.channel.send('Wanna learn more about this project?')
        await message.channel.send({ ephemeral: true, content: '', components: [row] });
        return;
    }
    
    let url = message.attachments.first().url
    let ext = path.extname(url)
    if (ext ==='.mp3' || ext ==='.wav'){
        message.channel.send('Audio file loading...')
        let captions = await getTranscription(url)
        console.log(captions)
        
        
        for (const i of captions) {
            transcript = transcript + i.text
        }

        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('getText')
                    .setLabel('Get Into Text')
                    .setStyle(ButtonStyle.Danger),
            );

        
        await message.channel.send({ ephemeral: true, content: '', components: [row] });
        
             
    }
        else {
            message.channel.send("This is not an audio file!")
            message.channel.send("Please send an audio file to get transcription")
            return;
        }



})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'getText') {
            // TODO : API CALL TO SYMBL.AI

            
            if (transcript) { 
                interaction.reply(`Audio Text: ${transcript}`)
                transcript = ''
                return;
             }
           else {
                interaction.reply('It seems that transcription failed, why not send the file again!')
           }
            

        }
    }
})

client.login(process.env.BOT_TOKEN) 




