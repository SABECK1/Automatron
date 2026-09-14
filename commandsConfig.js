const { SlashCommandBuilder } = require('discord.js');

const COMMAND_CONFIG = [
    {
        data: new SlashCommandBuilder()
            .setName('summarize')
            .setDescription('Summarize text via n8n')
            .addStringOption(option =>
                option.setName('text').setDescription('The text to summarize').setRequired(true)),
        webhookEnv: 'N8N_SUMMARIZE_WEBHOOK_URL'
    },
    {
        data: new SlashCommandBuilder()
            .setName('ticket')
            .setDescription('Create a support ticket')
            .addStringOption(option =>
                option.setName('issue').setDescription('Describe your issue').setRequired(true)),
        webhookEnv: 'N8N_TICKET_WEBHOOK_URL'
    }
];

module.exports = COMMAND_CONFIG;