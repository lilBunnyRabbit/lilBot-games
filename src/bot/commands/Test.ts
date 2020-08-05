import Discord from 'discord.js';
import { Command } from '../../imports/classes/Command';

export default new Command("Test", "This is my description").setCommand(Test);

function Test(msg: Discord.Message, args: Array<string>): any {
    return msg.channel.send("hello");
}
