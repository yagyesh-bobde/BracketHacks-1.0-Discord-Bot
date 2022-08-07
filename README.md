# BracketHacks-1.0-Discord-Bot

## Inspiration
BracketHacks inspired me to build this project
## What it does
This is a discord bot that you can deploy on your or any server for that matter, it will respond to users who have attached an audio/video file in their messages. It will use Symbl.ai APIs to get a transcription of the audio file and the reply to the user.
## How I built it
In a broad sense there were 4 stages for this project: 
1) Creating the discord bot in node.js with discord.js module
2) Creating API calls to Symb.ai and getting transcription
3) Connecting the earlier two to create a reply for the user
4) Deploying the discord boy
## Challenges I ran into
Since I haven't previously worked with discord.js I had to start from the scratch. I watched some tutorials and read the official docs and guides on the discord.js website. There were still two main errors I faced during this project: 
- I didn't know about the MessageContent intent in the discord developer portal which in turn made me unable to read user message content in the code base.
- It was my first time working with symbl.ai as well so I faced some issues, but the support team from the symbl.ai also helped in this, they asked me what issue I was facing and I consulted with them and eventually got the API calls to work. 
- finally, the deployment process was not that hard because I had already worked with node.js apps and Heroku before.
## Accomplishments 
I am very proud of the fact that I was able to develop this project from scratch, and also used other resources and also asking for help at forms like stack overflow and symbol ai.
## What I learned
I learned a lot during this project, especially since this is my first time creating a discord.js. I am now familiar with how to build a bot, what are intents, how to reply, how to send/receive attachments and some other fundamentals of discord.js
## What's next for Agent BracketHacks1.0 
I wanted to improve the replying capabilities of the bot by creating custom trained intents and then replying to user messages.
