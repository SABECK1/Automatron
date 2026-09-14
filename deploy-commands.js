require('dotenv').config();
const { REST, Routes } = require('discord.js');
const COMMAND_CONFIG = require('./commandsConfig');

const commands = COMMAND_CONFIG.map(c => c.data.toJSON());
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Refreshing guild-specific (/) commands...');

        // Use Routes.applicationGuildCommands for instant updates during development
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded guild commands instantly.');
    } catch (error) {
        console.error(error);
    }
})();