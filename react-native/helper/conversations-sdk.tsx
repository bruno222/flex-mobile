import { Client, Message } from '@twilio/conversations';
import { SetterOrUpdater } from 'recoil';

//
// Main Class
//
class Conversations {
  private client!: Client;
  private conversations!: any;
  private setConversations!: SetterOrUpdater<{}>;

  constructor() {}

  //
  // Public Functions
  //
  public startOfRefresh = (conversations: any, setConversations: SetterOrUpdater<{}>) => {
    this.conversations = conversations;
    this.setConversations = setConversations;
  };

  public updateToken = (token: string) => {
    // first time
    if (!this.client) {
      console.log('@@conversation - starting...');
      const options = {
        clientMetadata: {
          type: 'flex-mobile',
          app: 'flex-mobile',
          appv: '0.0.1',
        },
      };
      this.client = new Client(token, options);
      this.addListeners();
      return;
    }

    // afterwards
    console.log('@@conversation - updating token...');
    this.client.updateToken(token);
  };

  public addAgentAsParticipant = async (chSid: string) => {
    const me = this.client.user.identity;
    const conversation = await this.client.getConversationBySid(chSid);
    conversation.add(me);
  };

  public loadConversation = async (/*conversations: any, setConversations: any,*/ chSid: string) => {
    const me = this.client.user.identity;
    const getUniqueMessage = ({ body, index, sid, author }: Message) => ({ body, index, sid, author, isMe: me === author });
    const sendMessage = async (text: string) => await conversation.sendMessage(text);
    const onJustLogForNow = (event: string) => (a: any) => console.log(`@@conversations.on.${event}` /*a*/);

    // TODO: why so slow to send new messages when value is 100?! I think we have to work on Chat.tsx > ScrollView component, perhaps change to something more performant?!
    const MESSAGES_LOAD_COUNT = 10;
    console.log('@@conversation - loadChat chSid', chSid);

    if (this.conversations[chSid] && this.conversations[chSid].messages) {
      return;
    }

    const conversation = await this.client.getConversationBySid(chSid);
    const messagesObj = (await conversation.getMessages(MESSAGES_LOAD_COUNT)).items;
    const messages = messagesObj.map(getUniqueMessage);
    console.log('@@conversations - past messages: ', messages);

    this.setConversations((old: any) => {
      return {
        ...old,
        [chSid]: {
          messages,
          sendMessage,
        },
      };
    });

    // conversation.addListener('messageAdded', onJustLogForNow('messageAdded'));
    conversation.addListener('messageRemoved', onJustLogForNow('messageRemoved'));
    conversation.addListener('messageUpdated', onJustLogForNow('messageUpdated'));

    conversation.addListener('participantJoined', onJustLogForNow('participantJoined'));
    conversation.addListener('participantLeft', onJustLogForNow('participantLeft'));
    conversation.addListener('typingStarted', onJustLogForNow('typingStarted'));
    conversation.addListener('typingEnded', onJustLogForNow('typingEnded'));
    conversation.addListener('participantUpdated', onJustLogForNow('participantUpdated'));

    conversation.on('updated', onJustLogForNow('updated'));

    conversation.addListener('messageAdded', (message) => {
      console.log('@@converstion - messageAdded');
      this.setConversations((old: any) => {
        return {
          ...old,
          [chSid]: {
            sendMessage,
            messages: [...old[chSid].messages, getUniqueMessage(message)],
          },
        };
      });
    });
  };
  //
  // Private Functions
  //
  public addListeners = () => {
    this.client.onWithReplay('connectionStateChanged', (state: any) => {
      console.log('@@conversations - connectionStateChanged: ', state);
    });

    this.client.on('conversationJoined', (conversation: any) => {
      console.log('@@conversations - conversationJoined');
      // this.setState({ conversations: [...this.state.conversations, conversation] });
    });

    this.client.onWithReplay('conversationLeft', (conversation: any) => {
      console.log('@@conversations - conversationLeft: ' /*, conversation*/);
    });

    this.client.addListener('tokenAboutToExpire', (a: any) => {
      console.log(
        '@@conversations - tokenAboutToExpire - TODO: get the logic from the https://github.com/twilio/twilio-webchat-react-app, perhaps?'
        //a
      );
    });
  };

  //
  // Listeners
  //
}

export const conversationSdk = new Conversations();
