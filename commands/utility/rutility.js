const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads all commands."),

  async execute(interaction) {
    const baseFolder = "./commands";
    const folders = fs
      .readdirSync(baseFolder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const folder of folders) {
      const commandFiles = fs
        .readdirSync(`${baseFolder}/${folder}`)
        .filter((file) => file.endsWith(".js"));
      const commands = commandFiles.map((file) => path.parse(file).name);

      for (const command of commands) {
        delete require.cache[require.resolve(`../${folder}/${command}.js`)];

        try {
          interaction.client.commands.delete(command);
          const newCommand = require(`../${folder}/${command}.js`);
          interaction.client.commands.set(newCommand.data.name, newCommand);
        } catch (error) {
          console.error(error);
          await interaction.reply(
            `There was an error while reloading a command \`${command}\`:\n\`${error.message}\``
          );
          return; // Stop reloading the remaining commands if there's an error
        }
      }
    }

    await interaction.reply(`All commands were reloaded!`);
  },
};
