require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const COMMAND_CONFIG = require('./commandsConfig');

const {
    DISCORD_BOT_TOKEN,
    N8N_WEBHOOK_AUTH_TOKEN,
    TARGET_CHANNEL_ID = ''
} = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // Check if a target channel is enforced
    if (TARGET_CHANNEL_ID && interaction.channelId !== TARGET_CHANNEL_ID) {
        return interaction.reply({
            content: `This command can only be used in <#${TARGET_CHANNEL_ID}>.`,
            ephemeral: true
        });
    }

    const commandName = interaction.commandName;
    const commandConfig = COMMAND_CONFIG.find(c => c.data.name === commandName);

    if (!commandConfig) {
        return interaction.reply({ content: 'Unknown command.', ephemeral: true });
    }

    const targetWebhook = process.env[commandConfig.webhookEnv];
    if (!targetWebhook) {
        return interaction.reply({ content: 'Webhook URL not configured for this command.', ephemeral: true });
    }

    await interaction.deferReply();

    const options = {};
    interaction.options.data.forEach(opt => {
        options[opt.name] = opt.value;
    });

    const payload = {
        command: commandName,
        options: options,
        user: {
            id: interaction.user.id,
            username: interaction.user.username,
            displayName: interaction.user.displayName
        },
        channelId: interaction.channelId,
        guildId: interaction.guildId
    };

    try {
        const response = await axios.post(targetWebhook, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${N8N_WEBHOOK_AUTH_TOKEN}`
            }
        });

        // Handle plain text strings OR JSON objects seamlessly
        const replyMessage = typeof response.data === 'string'
            ? response.data
            : (response.data?.message || 'Task successfully sent to n8n!');

        await interaction.editReply(replyMessage);

    } catch (error) {
        console.error(`Webhook error for /${commandName}:`, error.message);
        await interaction.editReply('Failed to execute task.');
    }
});

client.login(DISCORD_BOT_TOKEN);