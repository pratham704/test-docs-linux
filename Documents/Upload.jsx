import React, { useState } from 'react';
import { Button, Image, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {uploadImageToServer} from './src/app/helper/uploadImage'
const UploadImageScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(null);

  const pickImage = async () => {
    setUploaded(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;

    setUploading(true);
    try {
      const response = await uploadImageToServer(imageUri); // Use the utility function
      setUploading(false);
      setUploaded(true);
      console.log('Upload success:', response);
    } catch (error) {
      setUploading(false);
      setError(error.message || 'Error uploading image');
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Image</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage} disabled={uploading || !imageUri}>
        {uploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>{uploaded ? 'Uploaded!' : 'Upload Image'}</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  imagePicker: {
    width: 250,
    height: 250,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  imagePickerText: {
    fontSize: 18,
    color: '#888',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
});

export default UploadImageScreen;
