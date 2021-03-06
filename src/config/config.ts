import dotenv from 'dotenv';
import YAML from 'yaml';
import fs from 'fs';

export function importConfigs(): Promise<any> {
    console.log("Importing config");
    
    return new Promise(async (resolve, reject) => {
        dotenv.config({ path: "./src/config/.env" });
        console.log(".env imported");
        const config = await YAML.parse(fs.readFileSync("./src/config/config.yaml", "utf8"));
        console.log("config.yaml imported");
        if(!config) reject();
        return resolve(config);
    });
}