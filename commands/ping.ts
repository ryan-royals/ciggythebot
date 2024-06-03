import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
      const channels = interaction.guild.channels.cache.map(
      (channel) => `${channel.name} (${channel.id})`
    );

  return interaction.reply(`Hey!!!!
This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.
This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.
I was bored and found these channels: \n${channels.join("\n")}`);
}
