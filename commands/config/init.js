const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("init")
    .setDescription("Configuration options for CiggyBot!"),
  async execute(interaction) {
    const sourceSelect = new ChannelSelectMenuBuilder()
      .setCustomId("source")
      .setChannelTypes("GuildText")
      .setPlaceholder("Incoming P1p1.");
    const row1 = new ActionRowBuilder().addComponents(sourceSelect);

    const destinationSelect = new ChannelSelectMenuBuilder()
      .setCustomId("destination")
      .setChannelTypes("GuildText")
      .setPlaceholder("Outgoing P1p1.");
    const row2 = new ActionRowBuilder().addComponents(destinationSelect);

    await interaction.reply({
      content: "Configuring CiggyBot!\n Select the source channel that has P1P",
      components: [row1],
    });
    await interaction.followUp({
      content: "Select the destination channel for the bot to post to.",
      components: [row2],
    });
  },
};
