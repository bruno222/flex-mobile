import {
  AlertDialog,
  ArrowBackIcon,
  ArrowForwardIcon,
  Avatar,
  Box,
  Button,
  CheckIcon,
  DeleteIcon,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  Spacer,
  StatusBar,
  Text,
  View,
  VStack,
} from 'native-base';
import React, { useState } from 'react';

export const Dialog = ({ cancelRef, isOpen, onClose, onDelete }: any) => {
  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>Are you sure?</AlertDialog.Header>
        <AlertDialog.Body>You won't be able to interact with this person unless he/she sends a message again.</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
              Cancel
            </Button>
            <Button colorScheme="danger" onPress={onDelete}>
              Delete
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};
