import { MessageEmbed } from 'discord.js';

export const LeaderboardEmbed = (players: string[], page: string, executing_user_data: string): MessageEmbed => new MessageEmbed()
.setColor("RANDOM")
.setTitle("Leaderboard")
.setDescription(players)
.addField("---------------------------------------", executing_user_data)
.setFooter(page);

export const MazeEmbed = (title: string, description: string): MessageEmbed => new MessageEmbed()
.setColor("RANDOM")
.setTitle(title || "Error")
.setDescription(description || "Error")
.addField('\u200b', '\u200b');

export const ConnectFourEmbed = (title: string, description: string, footer: string): MessageEmbed => new MessageEmbed()
.setColor("RANDOM")
.setTitle(title || "Error")
.setDescription(description || "Error")
.setFooter(footer)
.addField('\u200b', '\u200b');