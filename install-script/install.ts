import dotenv from 'dotenv';
import path from 'path';
import { Twilio } from 'twilio';
import { log, TaskRouterClass } from './helper';

const dotenvPath = path.resolve(process.cwd(), '../.env');
dotenv.config({
  path: dotenvPath,
});

const run = async () => {
  if (!process.env.ACCOUNT_SID || !process.env.AUTH_TOKEN) {
    return log(`It looks like your .env file is empty at:\n\n${dotenvPath}.\n\nAborting...`);
  }
  const friendlyName = 'Available on Mobile';
  const client = new Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
  const taskrouter = await TaskRouterClass(client);
  const activities = await taskrouter.activities.list();
  const hasAvailableOnMobile = activities.find((ac) => ac.friendlyName.includes(friendlyName));
  if (hasAvailableOnMobile) {
    return log(`Activity already existed.\n\nOpen flex.twilio.com and check if you now have the new activity called "${friendlyName}".`);
  }
  await taskrouter.activities.create({ available: true, friendlyName });
  return log(`All good until here.\n\nOpen flex.twilio.com and check if you now have the new activity called "${friendlyName}".`);
};

run();
