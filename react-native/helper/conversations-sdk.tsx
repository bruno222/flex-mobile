import { Client, Message } from '@twilio/conversations';
import { MessageStore, conversationsStore } from '../store/conversations-store';
import { flexTokenStore } from '../store/flex-token-store';

//
// Main Class
//
class Conversations {
  private client!: Client;
  constructor() {}

  //
  // Public Functions
  //
  public startOrRefresh = () => {
    const { token } = flexTokenStore;
    console.log('@@updateToken');
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

  public loadConversation = async (chSid: string) => {
    const me = this.client.user.identity;
    const getUniqueMessage = ({ body, index, sid, author }: Message) => ({ body, index, sid, author, isMe: me === author } as MessageStore);
    const sendMessage = async (text: string) => await conversation.sendMessage(text);
    const onJustLogForNow = (event: string) => (a: any) => console.log(`@@conversations.on.${event}` /*a*/);

    // TODO: why so slow to send new messages when value is 100?! I think we have to work on Chat.tsx > ScrollView component, perhaps change to something more performant?!
    const MESSAGES_LOAD_COUNT = 10;
    console.log('@@conversation - loadChat chSid', chSid, conversationsStore.get(chSid));

    if (conversationsStore.exists(chSid)) {
      return;
    }

    const conversation = await this.client.getConversationBySid(chSid);
    const messagesObj = (await conversation.getMessages(MESSAGES_LOAD_COUNT)).items;
    const messages = messagesObj.map(getUniqueMessage);

    conversationsStore.startNewChat(chSid, sendMessage, messages);

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
      conversationsStore.addMessage(chSid, getUniqueMessage(message));
    });
  };
  //
  // Private Functions
  //

  //
  // Listeners
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
}

export const conversationSdk = new Conversations();
