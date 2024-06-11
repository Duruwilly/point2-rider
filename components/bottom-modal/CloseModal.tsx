import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Delete from '../../assets/icon/delete.svg'; // Replace with actual path

export default function CloseModal({ setDeleteCard }: {setDeleteCard: Dispatch<SetStateAction<boolean>>}) {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.iconContainer}>
        <Delete width={21.33} height={24} />
      </View>

      <Text style={styles.modalTitle}>Are you sure?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Yes, delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDeleteCard(false)}
          style={styles.goBackButton}
        >
          <Text style={styles.goBackButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 64,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FCE6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#1D2939',
    fontWeight: 'bold',
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
  },
  deleteButton: {
    width: '48%',
    height: 44,
    borderRadius: 8,
    backgroundColor: '#0077B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  goBackButton: {
    width: '48%',
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EBF8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackButtonText: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: 'bold',
  },
});
