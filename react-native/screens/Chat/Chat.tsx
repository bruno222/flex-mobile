import {
  ArrowBackIcon,
  Box,
  DeleteIcon,
  HStack,
  IconButton,
  Input,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Spacer,
  StatusBar,
  Text,
} from 'native-base';
import React, { useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationSdk, loadConversation } from '../../helper/conversations-sdk';
import { ReservationActions, isReservationPending, taskrouterSdk } from '../../helper/taskrouter-sdk';
import { conversationState, taskState } from '../../state/state';
import { AcceptReject } from './components/AcceptReject';
import { Dialog } from './components/Dialog';
import { Loading } from '../../components/Loading';
import { SendText } from './components/SendText';

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
  const scrollViewRef = useRef();
  const tasks: any = useRecoilValue(taskState);
  const task = tasks[reservationSid];
  console.log('a@@task', task);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  // const [scrollValue, setScrollValue] = React.useState(10000);

  const cancelRef = React.useRef(null);

  const [conversations, setConversations] = useRecoilState(conversationState);
  const thisConversation = conversations[chSid] || { messages: [] };
  console.log('@@', thisConversation);

  const onDialogClose = () => setIsOpen(false);
  const onDialogDelete = async () => {
    setIsOpen(false);
    await taskrouterSdk.reservationAction(reservationSid, ReservationActions.complete);
    navigation.goBack();
  };

  conversationSdk.startOfRefresh(conversations, setConversations);

  // Load chat history
  if (!conversations[chSid]) {
    conversationSdk.loadConversation(chSid);
    return <Loading />;
  }

  const RenderMessage = ({ msg, backgroundColor, alignSelf }: any) => (
    <Box backgroundColor={backgroundColor} borderRadius={6} width="80%" padding={2} alignSelf={alignSelf} margin={2}>
      <Text>{msg.body}</Text>
      <Spacer />
      <Text fontSize="xs" color="coolGray.800" textAlign="right" paddingTop="2px">
        11:22
      </Text>
    </Box>
  );

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
          {!isReservationPending(task) && (
            <Pressable
              onPress={() => {
                console.log('blah1');
                setIsOpen(true);
              }}
            >
              <DeleteIcon size="5" mt="0.5" color="white" />
            </Pressable>
          )}
          <Dialog isOpen={isOpen} cancelRef={cancelRef} onClose={onDialogClose} onDelete={onDialogDelete} />
        </HStack>
      </HStack>

      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        // contentContainerStyle={{ flexGrow: 1 }}
        // onContentSizeChange={(a) => console.log('XXX', a)}
        // ref={(view) => (scrollView = view)}
        showsVerticalScrollIndicator={false}
        w="100%"
        backgroundColor="#e5ded4"
        h="80%"
        marginBottom="130px"
        contentOffset={{ y: 10000, x: 0 }}

        // onContentSizeChange={(a) => {
        //   a_root.scrollToEnd();
        // }}
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
