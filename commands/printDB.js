const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("printdb")
    .setDescription("Prints the database."),
  async execute(interaction) {
    const { results } = await env.DB.prepare("SELECT * FROM servers")
      .bind("servers")
      .all();
    await interaction.reply(`${results}`);
  },
};
