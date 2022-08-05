import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv';
import fetch from "node-fetch";
import getTranscription from './transcripy.js'

dotenv.config()

const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'DirectMessages', GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages]
})

client.on('ready', () => {
    console.log(client.user.tag)

    // const guildId = '1004396525528559656'
    // const guild = client.guilds.cache.get(guildId)
    // let commands;

    // if (guild) {
    //     commands = guild.commands;
    // }
    // else{
    //     commands = client.application?.commands;
    // }
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // get the file's URL 
    if (message.attachments.size === 0) { // Attachments are present.
        console.log(message.attachments)
        return message.channel.send('Please attach a audio file')
    }

    // const file = message.attachments.first()?.url;
    // try {
    //     message.channel.send('Reading the file! Fetching data...');

    //     // fetch the file from the external URL
    //     const response = await fetch(file);

    //     // if there was an error send a message with the status
    //     if (!response.ok)
    //         return message.channel.send(
    //             'There was an error with fetching the file:',
    //             response.statusText,
    //         );

    //     // take the response stream and read it to completion
    //     const text = await response.text();

    //     if (text) {
    //         message.channel.send(`\`\`\`${text}\`\`\``);
    //     }
    // } catch (error) {
    //     console.log(error);
    // }


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('getText')
                .setLabel('Get Into Text')
                .setStyle(ButtonStyle.Primary),
        );

    await msg.channel.send({ ephemeral: true, content: 'Click this button to transcribe & get a reply for the audio file!', components: [row] });

})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'getText') {
            // TODO : API CALL TO SYMBL.AI
            interaction.channel.send('Transcription in progress')
            // let transcription = getTranscription('Test',)

        }
    }
})

client.login(process.env.BOT_TOKEN) 