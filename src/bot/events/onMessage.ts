import Discord from 'discord.js';
import { EventHandler } from '../../imports/classes/EventHandler';

export default new EventHandler("message", function(this: any, msg: Discord.Message) {
    if(msg.author.bot) return;
    return executeCommand(this, msg);
});

function executeCommand(client: any, msg: Discord.Message) {
    if(!msg.content.startsWith(client.prefix)) return;
    const args: Array<string> = msg.content.slice(client.prefix.length).split(/ +/);
    const command_name = args.shift()?.toUpperCase();
    if(!client.commands.has(command_name)) return;
    const command = client.commands.get(command_name);
    try {
        return command.execute(msg, args);
    } catch (error) {
        return console.error(error)
    }
}