import { ArrowBackIcon, Box, HStack, IconButton, KeyboardAvoidingView, ScrollView, StatusBar, Text } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { conversationSdk } from '../../helper/conversations-sdk';
import { ReservationActions, isReservationPending, taskrouterSdk } from '../../helper/taskrouter-sdk';
import { conversationState, unreadBadgeState } from '../../state/state';
import { AcceptReject } from './components/AcceptReject';
import { Dialog } from './components/Dialog';
import { Loading } from '../../components/Loading';
import { SendText } from './components/SendText';
import { RenderMessage } from './components/RenderMessage';
import { IconOutboundCall } from './components/IconOutboundCall';
import { IconDelete } from './components/IconDelete';
import { IconInfo } from './components/IconInfo';
import { reservationsStore } from '../store/reservations-store';

interface Props {
  navigation: any;
  route: {
    params: {
      chSid: string;
      name: string;
      reservationSid: string;
    };
  };
}

export const Chat = ({
  navigation,
  route: {
    params: { chSid, name, reservationSid },
  },
}: Props) => {
  // const tasks: any = useRecoilValue(taskState);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [conversations, setConversations] = useRecoilState(conversationState);
  const [unreadBadge, setUnreadBadge] = useRecoilState(unreadBadgeState);
  const scrollViewRef = useRef();
  const cancelRef = React.useRef(null);
  const task = reservationsStore.get(reservationSid);
  const thisConversation = conversations[chSid] || { messages: [] };

  const onDialogClose = () => setIsOpen(false);
  const onDialogDelete = async () => {
    setIsOpen(false);
    await taskrouterSdk.reservationAction(reservationSid, ReservationActions.complete);
    navigation.goBack();
  };

  // To control the unreadBadge
  //   -1 --> "this chSid window is the active one"
  //   0  --> "not anymore"
  useEffect(() => {
    setUnreadBadge((old: any) => ({
      ...old,
      [chSid]: -1,
    }));

    return () => {
      setUnreadBadge((old: any) => ({
        ...old,
        [chSid]: 0,
      }));
    };
  }, []);

  // Fetch messages and update Setters inside of the SDK
  useEffect(() => {
    conversationSdk.startOrRefreshSetters(conversations, setConversations, setUnreadBadge);
    conversationSdk.loadConversation(chSid);
  }, []);

  if (!conversations[chSid]) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView behavior={'height'} keyboardVerticalOffset={-20}>
      <StatusBar backgroundColor="#f22e45" barStyle="light-content" />
      <Box safeAreaTop bg="blue.300" />
      <HStack bg="#f22e45" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
        <HStack alignItems="center">
          <IconButton onPress={navigation.goBack} paddingLeft="7px" icon={<ArrowBackIcon color="white" />} />
          <Text color="white" fontSize="20" fontWeight="bold" paddingLeft="7px" isTruncated maxWidth="85%">
            {name}
          </Text>
        </HStack>
        {/* <HStack paddingRight="10px">
          <DeleteIcon size="5" mt="0.5" color="white" />
        </HStack> */}
        <HStack paddingRight="10px">
          <IconInfo attributes={task.attributes} navigate={navigation.navigate} />
          <IconOutboundCall from={task.attributes.from} />
          <IconDelete task={task} setIsOpen={setIsOpen} />
          <Dialog isOpen={isOpen} cancelRef={cancelRef} onClose={onDialogClose} onDelete={onDialogDelete} />
        </HStack>
      </HStack>

      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
        w="100%"
        backgroundColor="#e5ded4"
        h="80%"
        marginBottom="130px"
        contentOffset={{ y: 10000, x: 0 }}
      >
        <Box>
          {thisConversation.messages!.map((msg: any) => (
            <RenderMessage
              msg={msg}
              backgroundColor={msg.isMe ? 'red.100' : 'white'}
              alignSelf={msg.isMe ? 'flex-end' : 'flex-start'}
              key={msg.sid}
            />
          ))}
        </Box>
      </ScrollView>
      {isReservationPending(task) ? (
        <AcceptReject reservationSid={task.reservationSid} chSid={chSid} goBack={navigation.goBack} />
      ) : (
        <SendText inputText={inputText} setInputText={setInputText} sendMessage={thisConversation.sendMessage} />
      )}
    </KeyboardAvoidingView>
  );
};
