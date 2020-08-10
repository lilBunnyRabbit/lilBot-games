  
import { User, DMChannel, TextChannel, NewsChannel, Message, ReactionCollector, MessageEmbed, MessageReaction, GuildMember } from "discord.js";
import { ConnectFourEmbed } from "../imports/embeds/Embeds";

export class ConnectFour {
    private player_1: GuildMember;
    private player_2: GuildMember;
    private channel: DMChannel | TextChannel | NewsChannel;
    private message: Message | undefined;
    private reaction_collector: ReactionCollector | undefined;
    private game_max_time: number = 1000 * 60 * 10; // 10 minutes
    private grid: number[][];
    private current_player: GuildMember;

    private valid_reactions: string[] = [
        '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '❌', 
    ];

    constructor(player_1: GuildMember, player_2: GuildMember, channel: DMChannel | TextChannel | NewsChannel) {
        this.player_1 = player_1;
        this.player_2 = player_2;
        this.channel = channel;
        this.grid = new Array(6).fill(0).map(() => new Array(7).fill(0));
        this.current_player = player_1;
        this.channel.send(this.createGameEmbed()).then(this.onFirstSend.bind(this));
    }

    private createGameEmbed(): MessageEmbed {
        return ConnectFourEmbed(
            `${this.player_1.displayName} vs ${this.player_2.displayName}`,
            this.getEmojiGrid(),
            `${this.current_player.displayName}'s move!`
        );
    }

    private getEmojiGrid(): string {
        return this.grid.map((row: number[]) => `⬜${ row.map(this.getElement).join("") }⬜`).join("\n")
             + "\n⬜1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣⬜";
    }

    private getElement(id: number): string {
        switch (id) {
            case 0: return "⬛";
            case 1: return "⬜";
            case 2: return "🔴";
            case 3: return "🔵";
            case 4: return "❤️";
            case 5: return "💙";
            default: return "❌"
        }
    }

    private onFirstSend(send_message: Message) {
        this.valid_reactions.forEach((valid_reaction: string) => send_message.react(valid_reaction));
        this.message = send_message;
        this.reaction_collector = send_message.createReactionCollector(
            this.collectorFilter.bind(this), 
            { time: this.game_max_time }
        );
        this.reaction_collector.on("collect", this.onCollect.bind(this));
        this.reaction_collector.on("end", () => this.end());
    } 

    private collectorFilter(reaction: MessageReaction, user: User) {
        return !user.bot 
            && (user.id === this.player_1.id || user.id === this.player_2.id)
            && this.valid_reactions.includes(reaction.emoji.name);
    }

    private updateEmbed(winner?: GuildMember) {
        const old_embed: MessageEmbed | undefined = this.message?.embeds[0];

        if(old_embed) {
            const new_embed: MessageEmbed = old_embed.setDescription(this.getEmojiGrid()).setFooter(`${this.current_player.displayName}'s move!`);
            if(winner) new_embed.addField("Results", `\n<@${winner.id}> won!`);
            this.message?.edit(new_embed);
        }
    }

    private onCollect(reaction: MessageReaction, user: User) {
        try { reaction.users.remove(user.id); } 
        catch (error) {}

        if(user.id !== this.current_player.id) return;

        switch(reaction.emoji.name) {
            case '1️⃣': return this.dropCoin(0);
            case '2️⃣': return this.dropCoin(1);
            case '3️⃣': return this.dropCoin(2);
            case '4️⃣': return this.dropCoin(3);
            case '5️⃣': return this.dropCoin(4);
            case '6️⃣': return this.dropCoin(5);
            case '7️⃣': return this.dropCoin(6);
            case '❌': return this.end();
            default: return;
        }
    }

    private dropCoin(position: number) {
        if(this.grid[0][position] !== 0) return;
        for (let i = 0; i <= this.grid.length; i++) {
            if(this.grid[i] && this.grid[i][position] === 0) continue;
            if(this.current_player === this.player_1) {
                this.grid[i - 1][position] = 2;
                this.current_player = this.player_2;
                return this.checkGrid();
            }
            
            if(this.current_player.id === this.player_2.id) {
                this.grid[i - 1][position] = 3;
                this.current_player = this.player_1;
                return this.checkGrid();
            }
        }
    }

    private checkGrid() {
        for (let j = 0; j < this.grid.length; j++) {
            for (let i = 0; i < this.grid[j].length; i++) {
                const winningPath: { path: number[][], winner: GuildMember } | undefined = this.checkBlock(i, j);
                if(winningPath) {
                    for(const position of winningPath.path) {
                        if(winningPath.winner.id === this.player_1.id) this.grid[position[1]][position[0]] = 4;
                        else if(winningPath.winner.id === this.player_2.id) this.grid[position[1]][position[0]] = 5;
                    }
                    return this.end(winningPath.winner);
                }
            }
        }

        return this.updateEmbed();
    }

    private checkBlock(x: number, y: number): { path: number[][], winner: GuildMember } | undefined {  
        const start_block: number = this.grid[y][x];
        if(start_block !== 2 && start_block !== 3) return;
        const directions = [ 
            [ 1, 0 ], [ 0, 1 ], [ -1, 0 ], [ 0, -1 ],
            [ 1, 1 ], [ 1, -1 ], [ -1, 1 ], [ -1, -1 ],
        ];

        const recursiveSearch = (x_: number, y_: number, direction: number[], iterations: number, path: number[][]): { iterations: number, path: number[][] } => {
            const new_x = x_ + direction[0];
            const new_y = y_ + direction[1];

            const current_block: number | undefined = this.grid[new_y] && this.grid[new_y][new_x];
            if(current_block !== start_block) return { iterations, path };

            path.push([new_x, new_y]);

            return recursiveSearch(new_x, new_y, direction, iterations + 1, path);
        }

        for(const direction of directions) {
            const { iterations, path } = recursiveSearch(x, y, direction, 1, [[x, y]]);
            if(iterations >= 4) return { path, winner: start_block === 2 ? this.player_1 : this.player_2 }
        }
    }

    public end(winner?: GuildMember) {
        this.updateEmbed(winner);
        this.message?.reactions.removeAll();
        return this.reaction_collector?.stop();
    }
}