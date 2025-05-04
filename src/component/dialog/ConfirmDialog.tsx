import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = '本桌已被使用中！',
  content,
  onClose,
  onConfirm,
  confirmText = '預約開台',
  cancelText = '結束',
}) => {
  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <View style={styles.iconWrapper}>
          <FontAwesome name="exclamation-circle" size={60} color="#EF6E6B" />
        </View>

        {/* 標題 */}
        <Text style={styles.title}>{title}</Text>

        {/* 內文 */}
        <Text style={styles.content}>{content}</Text>

        {/* 按鈕區塊 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <FontAwesome name="times" size={16} color="#fff" />
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ConfirmDialog;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  dialog: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconWrapper: {
    borderRadius: 50,
    padding: 14,
    marginBottom: 10,
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
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: '#F67943',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#DC082F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    gap: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
