import { SlashCommandBuilder } from "discord.js";
import { userCommands, utilityCommands } from "./index";
import { REST, Routes } from "discord.js";
import { config } from "../config";

export const data = new SlashCommandBuilder()
  .setName("reload")
  .setDescription("Reloads all commands.");

export async function execute(interaction) {
  console.log("Reloading all commands...");

  for (let commandName in userCommands) {
    console.log(`Reloading command ${commandName}...`);
    delete require.cache[require.resolve(`./${commandName}.ts`)];
    try {
      const newCommand = require(`./${commandName}.ts`);
      userCommands[commandName] = newCommand;
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``,
        ephemeral: true,
      });
    }
  }
  for (let commandName in utilityCommands) {
    console.log(`Reloading command ${commandName}...`);
    delete require.cache[require.resolve(`./${commandName}.ts`)];
    try {
      const newCommand = require(`./${commandName}.ts`);
      utilityCommands[commandName] = newCommand;
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``,
        ephemeral: true,
      });
    }
  }

  console.log("All commands have been reloaded, now publishing them...");

  const allCommands = { ...userCommands, ...utilityCommands };
  const commandsData = Object.values(allCommands).map(
    (command) => command.data
  );
  const rest = new REST().setToken(config.DISCORD_TOKEN);
  await rest
    .put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
      body: commandsData,
    })
    .then((responseData) => {
      console.log(responseData);
    });

  interaction.reply({
    content: "All commands have been reloaded!",
    ephemeral: true,
  });
}
