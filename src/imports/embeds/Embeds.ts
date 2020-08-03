import { MessageEmbed } from 'discord.js';

export const LeaderboardEmbed = (players: string[], page: string, executing_user_data: string): MessageEmbed => new MessageEmbed()
.setColor("RANDOM")
.setTitle("Leaderboard")
.setDescription(players)
.addField("---------------------------------------", executing_user_data)
.setFooter(page);

export const TestGameEmbed = (description: string): MessageEmbed => new MessageEmbed()
.setColor("RANDOM")
.setTitle("Game")
.setDescription(description || "Error")
.addField('\u200b', '\u200b');