import { SlashCommandBuilder } from '@discordjs/builders';

const { name, description } = {
  name: 'server',
  description: 'Replies with server info!',
};

export = {
  data: new SlashCommandBuilder().setName(name).setDescription(description),
  async execute(interaction: any) {
    const { guild } = interaction;
    await interaction.reply({
      content: `Server name: ${guild.name}\nTotal members: ${guild.memberCount}`,
      ephemeral: true,
    });
  },
};
