import { Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { isReservationPending } from '../../../helper/taskrouter-sdk';
import { TouchableOpacity } from 'react-native';

export const IconDelete = ({ task, setIsOpen }: any) => {
  if (isReservationPending(task)) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('blah1');
        setIsOpen(true);
      }}
    >
      <Icon as={AntDesign} name="delete" size="5" mt="0.5" marginRight="7px" color="white" />
    </TouchableOpacity>
  );
};
