import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
interface OptionButtonProps {
  icon: string;
  title: string;
  description?: string;
  onPress: () => void;
}

const HomeOptionButton: React.FC<OptionButtonProps> = ({
  icon,
  title,
  description,
  onPress,
}) => {
  return (
    <View style={styles.optionContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Icon name={icon} size={20} color="#000" />
        <Text style={styles.buttonText}>{title}</Text>
        <Icon
          name="chevron-right"
          size={18}
          color="#000"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    backgroundColor: '#0A0A30',
    borderRadius: 10,
    padding: 32,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 40,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginLeft: 10,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  description: {
    color: '#00BFFF',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeOptionButton;
