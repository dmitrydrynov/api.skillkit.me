import fs from 'fs';
import { env } from '@config/env';
import { Client, Collection, Intents } from 'discord.js';
import { SlashCommand } from './definitions';

type CustomClient = Client & {
  commands?: any;
};

const client: CustomClient = new Client({ intents: [Intents.FLAGS.GUILDS] });

/** SLASH COMMANDS */
client.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname + '/commands').filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
  const command: SlashCommand = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

/** EVENTS */
const eventFiles = fs.readdirSync(__dirname + '/events').filter((file) => file.endsWith('.ts'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// INTERACTIONS
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(env.DISCORD_TOKEN);
