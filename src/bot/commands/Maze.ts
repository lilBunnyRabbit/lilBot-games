import Discord from 'discord.js';
import { Command } from '../../imports/classes/Command';
import { Maze } from '../../games/Maze';

export default new Command("Maze", "This is my description").setCommand(MazeCommand);

function MazeCommand(msg: Discord.Message, args: Array<string>): any {
    return new Maze(msg.author, msg.channel, 8, 5);
}
