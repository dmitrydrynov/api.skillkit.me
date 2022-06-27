import { SlashCommandBuilder } from '@discordjs/builders';

const { name, description } = {
  name: 'user',
  description: 'Replies with user info!',
};

export = {
  data: new SlashCommandBuilder().setName(name).setDescription(description),
  async execute(interaction: any) {
    const { user } = interaction;

    await interaction.reply({
      content: `Your username: ${user.username}\nYour id: ${user.id}`,
      ephemeral: true,
    });
  },
};
