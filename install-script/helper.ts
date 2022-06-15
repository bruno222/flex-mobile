import { Twilio as TwilioInterface } from 'twilio';

export const TaskRouterClass = async (twilioClient: TwilioInterface) => {
  const workspaces = await twilioClient.taskrouter.workspaces.list();
  if (workspaces.length !== 1) {
    throw new Error('Hum.. This is not a Flex account, is it? Why do you have more than one TaskRouter Workspace? You cant!');
  }
  const workspaceSid = workspaces[0].sid;
  return twilioClient.taskrouter.workspaces(workspaceSid);
};

export const log = (msg: string) => {
  console.log(`\n\n\n${msg}\n\n\n`);
};
