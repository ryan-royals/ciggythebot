const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a command.")
    .addStringOption((option) =>
      option
        .setName("folder")
        .setDescription("The folder where the command is located.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to reload.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const commandName = interaction.options
      .getString("command", true)
      .toLowerCase();
    const command = interaction.client.commands.get(commandName);
    const folder = interaction.options.getString("folder", true).toLowerCase();

    if (!command) {
      return interaction.reply(
        `There is no command with name \`${commandName}\` in the \`${folder}\` folder! \n If i was better at JS I would print a tree of what I found here, but you are on your own. `
      );
    }

    delete require.cache[
      require.resolve(`../${folder}/${command.data.name}.js`)
    ];

    try {
      interaction.client.commands.delete(command.data.name);
      const newCommand = require(`../${folder}/${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      await interaction.reply(
        `Command \`${newCommand.data.name}\` was reloaded!`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``
      );
    }
  },
};
