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
    const destinationChannel = interaction.guild.channels.cache.get(channel.destination);

    const messages = await sourceChannel.messages.fetch();
    console.log(messages)
    
  },
};
