import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface InfoDialogProps {
  isOpen: boolean;
  title?: string;
  content: string;
  confirmText?: string;
  onClose: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({
  isOpen,
  title = '提示訊息',
  content,
  confirmText = '確認',
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <View style={styles.iconWrapper}>
          <FontAwesome name="exclamation-circle" size={60} color="#5BC0EB" />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>

        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InfoDialog;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  dialog: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  iconWrapper: {
    borderRadius: 50,
    padding: 14,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  content: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#5BC0EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
