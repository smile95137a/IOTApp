import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
interface OptionButtonProps {
  icon: React.ReactNode; // 改為 component
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
        {icon}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 5,
          }}
        >
          <Text style={styles.buttonText}>{title}</Text>
          <MaterialIcons
            name="chevron-right"
            size={40}
            color="#000"
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    backgroundColor: '#01003C',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#FFC702',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 40,
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  description: {
    color: '#02C3ED',
    fontSize: 16,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default HomeOptionButton;
