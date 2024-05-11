const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("init")
    .setDescription("Configuration options for CiggyBot!"),
  async execute(interaction) {
    const sourceSelect = new ChannelSelectMenuBuilder()
      .setCustomId("source")
      .setChannelTypes("GuildText")
      .setPlaceholder("P1p1 image storage channel.");
    const row1 = new ActionRowBuilder().addComponents(sourceSelect);

    const destinationSelect = new ChannelSelectMenuBuilder()
      .setCustomId("destination")
      .setChannelTypes("GuildText")
      .setPlaceholder("P1p1 post destination channel");
    const row2 = new ActionRowBuilder().addComponents(destinationSelect);

    const timeSelect = new StringSelectMenuBuilder()
      .setCustomId("time")
      .setPlaceholder("How often to post.")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Every hour")
          .setValue("1"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Every 6 hours")
          .setValue("6"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Every 12 hours")
          .setValue("12")
      );
    const row3 = new ActionRowBuilder().addComponents(timeSelect);

    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Primary);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger);

    const row4 = new ActionRowBuilder().addComponents(confirm, cancel);

    const response = await interaction.reply({
      content: "Configuring CiggyBot!",
      components: [row1, row2, row3, row4],
      ephemeral: true,
    });

    const collector = response.createMessageComponentCollector({
      time: 120_000,
    });

    const results = {
      source: "",
      destination: "",
      time: "",
    };

    collector.on("collect", async (i) => {
      await i.deferUpdate();
      collector.resetTimer();

      const selection = Array.isArray(i.values) ? i.values[0] : i.values;
      console.log(`${i.user} has selected ${selection}!`);
      console.log(`${i.customId} ${selection}`);

      const idMap = {
        source: "source",
        destination: "destination",
        time: "time",
      };

      if (idMap[i.customId]) {
        results[idMap[i.customId]] = selection;
      }

      if (i.customId === "confirm") {
        console.log("Confirming!");
        console.log(results);
        let timeString = `${results["time"]} ${
          results["time"] === "1" ? "Hour" : "Hours"
        }`;
        interaction.editReply({
          // Formatter is cracking the shits, so it is going to stay looking like this.
          content: `Configuration complete!\n
Source: ${await interaction.guild.channels.fetch(results["source"])}
Destination: ${await interaction.guild.channels.fetch(results["destination"])} 
Time: ${timeString}`,
          components: [],
        });
        manuallyStopped = true;
        collector.stop();
      }
      if (i.customId == "cancel") {
        interaction.editReply({
          content: "Configuration cancelled!",
          components: [],
        });
        manuallyStopped = true;
        collector.stop();
      }
    });

    collector.on("end", async () => {
      if (!manuallyStopped) {
        await interaction.editReply({
          content: "Sorry, this has timed out! \n Please try again",
          components: [],
        });
      }
    });
  },
};
