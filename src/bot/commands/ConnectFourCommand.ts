import Discord, { GuildMember } from 'discord.js';
import { Command } from '../../imports/classes/Command';
import { ConnectFour } from '../../games/ConnectFour';

export default new Command("C4", "This is my description").setCommand(ConnectFourCommand);

function ConnectFourCommand(msg: Discord.Message, args: Array<string>): any {
    const player_1: GuildMember | null = msg.member;
    const player_2: GuildMember | undefined = msg.mentions.members?.first();
    if(!player_1 || !player_2) return;
    if(player_1 === player_2) return;
    return new ConnectFour(player_1, player_2, msg.channel);
}
