const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("listchannels")
    .setDescription("List all channels in the server."),
  async execute(interaction) {
    const channels = interaction.guild.channels.cache.map(
      (channel) => `${channel.name} (${channel.id})`
    );

    await interaction.reply(`Channels:\n${channels.join("\n")}`);
  }
}