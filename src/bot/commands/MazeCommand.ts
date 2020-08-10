import Discord from 'discord.js';
import { Command } from '../../imports/classes/Command';
import { Maze } from '../../games/Maze';

export default new Command("Maze", "This is my description").setCommand(MazeCommand);

function MazeCommand(msg: Discord.Message, args: Array<string>): any {
    if(!msg.member) return;
    return new Maze(msg.member, msg.channel, 8, 5);
}
