const { SlashCommandBuilder } = require('discord.js');

const COMMAND_CONFIG = [
    {
        data: new SlashCommandBuilder()
            .setName('appointment')
            .setDescription('Manage your appointments (create, modify, delete)')
            .addStringOption(option =>
                option.setName('action')
                    .setDescription('What do you want to do?')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Create', value: 'create' },
                        { name: 'Modify', value: 'modify' },
                        { name: 'Delete', value: 'delete' }
                    ))
            .addStringOption(option =>
                option.setName('title')
                    .setDescription('Event title (e.g., "Dentist" or "Meeting ID")')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('time')
                    .setDescription('Date/Time (required for create/modify, e.g., "2026-10-15 14:00")')
                    .setRequired(false)),
        webhookEnv: 'N8N_APPOINTMENT_WEBHOOK_URL'
    }
];

module.exports = COMMAND_CONFIG;