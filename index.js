require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const {
    DISCORD_BOT_TOKEN,
    N8N_WEBHOOK_URL,
    N8N_WEBHOOK_AUTH_TOKEN,
    TARGET_CHANNEL_ID = ''
} = process.env;

if (!DISCORD_BOT_TOKEN || !N8N_WEBHOOK_URL || !N8N_WEBHOOK_AUTH_TOKEN) {
    throw new Error(
        'DISCORD_BOT_TOKEN, N8N_WEBHOOK_URL, and N8N_WEBHOOK_AUTH_TOKEN must be set in .env'
    );
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // An empty target channel means that messages from every channel are accepted.
    if (TARGET_CHANNEL_ID && message.channel.id !== TARGET_CHANNEL_ID) return;

    const messageData = {
        content: message.content,
        author: {
            id: message.author.id,
            username: message.author.username,
            displayName: message.author.displayName || message.author.username
        },
        channel: {
            id: message.channel.id,
            name: message.channel.name
        },
        guild: message.guild
            ? {
                id: message.guild.id,
                name: message.guild.name
            }
            : null,
        timestamp: message.createdAt.toISOString(),
        messageId: message.id,
        attachments: message.attachments.map((attachment) => ({
            id: attachment.id,
            filename: attachment.name,
            url: attachment.url,
            contentType: attachment.contentType
        }))
    };

    try {
        console.log(`Forwarding message ${message.id} to n8n...`);

        const response = await axios.post(N8N_WEBHOOK_URL, messageData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${N8N_WEBHOOK_AUTH_TOKEN}`
            }
        });

        if (response.status >= 200 && response.status < 300) {
            console.log(`Message sent to n8n: ${message.content.substring(0, 50)}...`);
        }
    } catch (error) {
        console.error('Webhook error:', {
            message: error.message,
            status: error.response?.status,
            response: error.response?.data
        });
    }
});

client.on('error', console.error);

client.login(DISCORD_BOT_TOKEN);
