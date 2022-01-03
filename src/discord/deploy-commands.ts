import fs from 'fs';
import { env } from '@config/env';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommand } from './definitions';

const commands = [];
const commandFiles = fs.readdirSync(__dirname + '/commands').filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
  const command: SlashCommand = require(`./commands/${file}`);

  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(env.DISCORD_TOKEN);

rest
  .put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
