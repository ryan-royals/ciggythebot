import { Client } from "discord.js";
import { config } from "./config";
import { userCommands, utilityCommands } from "./commands";
import { deployCommands } from "./deploy-commands";
export { client };

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (utilityCommands[commandName as keyof typeof utilityCommands]) {
    utilityCommands[commandName as keyof typeof utilityCommands].execute(
      interaction
    );
    // if (userCommands[commandName as keyof typeof userCommands]) {
    //   userCommands[commandName as keyof typeof userCommands].execute(
    //     interaction
    //   );
    // }
  }
});

client.login(config.DISCORD_TOKEN);




