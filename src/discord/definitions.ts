import { SlashCommandBuilder } from '@discordjs/builders';

export type SlashCommand = {
  data: SlashCommandBuilder;
  execute: () => void | Promise<void>;
};
