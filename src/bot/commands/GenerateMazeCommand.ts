import Discord from 'discord.js';
import { Command } from '../../imports/classes/Command';
import { generateMaze } from '../../game_gen/Maze_gen';
import Canvas from 'canvas';

const block_size: number = 10;
const size_limit: number = 250;

export default new Command("GenMaze", "This is my description").setCommand(GenerateMazeCommand);

function GenerateMazeCommand(msg: Discord.Message, args: Array<string>): any {
    let width: number = 10;
    let height: number = 10;

    if(args.length >= 2) {
        const new_width: number = +args[0];
        const new_height: number = +args[1];
        if(new_width && new_height && new_width <= size_limit && new_height <= size_limit) {
            width = new_width;
            height = new_height;
        }
    }

    const maze_array: number[][] = generateMaze(width, height);
    maze_array[0][1] = 3;

    const canvas: Canvas.Canvas = Canvas.createCanvas(maze_array[0].length * block_size, maze_array.length * block_size);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    const color_scheme: { [key: number]: string } = {
        0: "#ffffff",
        1: "#000000",
        2: "#ffffff",
        3: "#ffffff",
        4: "#ffffff",
    }

    for (let y = 0; y < maze_array.length; y++) {
        for (let x = 0; x < maze_array[y].length; x++) {
            ctx.fillStyle = color_scheme[maze_array[y][x]] || "#ffffff";
            ctx.fillRect(x * block_size, y * block_size, block_size, block_size);
        }
    }

    const attachment: Discord.MessageAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'maze.png');
	return msg.channel.send(attachment);
}
