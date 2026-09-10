# Discord to n8n bot

A small Discord bot that forwards messages to an n8n webhook.

## Setup

1. Install Node.js 18 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`.
4. Set `DISCORD_BOT_TOKEN`, `N8N_WEBHOOK_URL`, and a long random `N8N_WEBHOOK_AUTH_TOKEN` in `.env`.
5. Optionally set `TARGET_CHANNEL_ID` to listen to one channel only. Leave it blank to listen to every channel.
6. Start the bot:

   ```bash
   npm start
   ```

For a URL containing `/webhook-test/`, open the workflow in n8n and click **Listen for test event** before sending a Discord message. For normal operation, activate the workflow and use the production URL containing `/webhook/` instead.

## Discord configuration

In the Discord Developer Portal, enable the **Message Content Intent** for the bot. When adding the bot to a server, grant it permission to view channels and read message history.

Never commit `.env` or share your bot token.

## n8n authentication

The bot sends this header with every webhook request:

```text
Authorization: Bearer <N8N_WEBHOOK_AUTH_TOKEN>
```

In n8n, check that the incoming `Authorization` header matches the same secret before processing the request. The Ed25519 code in the question is for verifying Discord interaction requests sent directly by Discord; it cannot verify requests sent from this bot because those requests are not signed by Discord.
