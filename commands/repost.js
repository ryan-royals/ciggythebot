const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("repost")
    .setDescription("Move random post from A to B"),

  async execute(interaction) {
    const channel = {
      source: `1237321242495811624`,
      destination: `1237321261894340638`,
    };

    const sourceChannel = interaction.guild.channels.cache.get(channel.source);
    const destinationChannel = interaction.guild.channels.cache.get(
      channel.destination
    );
    const messages = await sourceChannel.messages.fetch();
    const imageMessages = messages.filter((message) =>
      message.attachments.some((attachment) =>
        attachment.contentType.startsWith("image/")
      )
    );

    // Filter out messages that have a certain reaction
    const unusedImageMessages = imageMessages.filter(
      (message) => !message.reactions.cache.has("🔄")
    );

    // Select a random message
    const randomMessage = unusedImageMessages.random();

    if (!randomMessage) {
      console.log("No unused images found");
      return;
    }

    const now = new Date();
    const threadName = `${now.getDate().toString().padStart(2, "0")}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    const thread = await destinationChannel.threads.create({
      name: threadName,
      autoArchiveDuration: 60,
      reason: "New image thread",
    });

    await thread.send({
      files: randomMessage.attachments.map((attachment) => attachment.url),
    });

    // React to the selected message
    await randomMessage.react("🔄");
  },
};
