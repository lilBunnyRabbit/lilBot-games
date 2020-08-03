import { importConfigs } from './config/config';
import createBot from './bot/createBot';

(async () => {
    const config = await importConfigs();
    await createBot(config.prefix);
})();
