import { Icon, Pressable } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { isReservationPending } from '../../../helper/taskrouter-sdk';

export const IconDelete = ({ task, setIsOpen }: any) => {
  if (isReservationPending(task)) {
    return null;
  }

  return (
    <Pressable
      onPress={() => {
        console.log('blah1');
        setIsOpen(true);
      }}
    >
      <Icon as={AntDesign} name="delete" size="5" mt="0.5" marginRight="7px" color="white" />
    </Pressable>
  );
};
