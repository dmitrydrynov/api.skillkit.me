import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

const { name, description } = {
  name: 'ping',
  description: 'Replies with pong!',
};

export = {
  data: new SlashCommandBuilder().setName(name).setDescription(description),
  async execute(interaction: any) {
    const row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('primary').setLabel('Primary').setStyle('PRIMARY'),
    );

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Some title')
      .setURL('https://discord.js.org')
      .setDescription('Some description here');

    await interaction.reply({ content: 'Pong!', components: [row], embeds: [embed], ephemeral: true });
  },
};
