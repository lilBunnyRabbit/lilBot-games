import Discord from 'discord.js';
import { Command } from '../../imports/classes/Command';
import { TestGame } from '../../games/TestGame';

export default new Command("Test", "This is my description").setCommand(Test);

function Test(msg: Discord.Message, args: Array<string>): any {
    new TestGame(msg.author, msg.channel, 13, 13);
    // return msg.channel.send("hello");
}
