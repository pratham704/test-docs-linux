import React, { useState, useEffect  , useCallback} from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { uploadImageToServer } from '../utils/helper/uploadImage';
import AddToFolder from './AddToFolder'; // Import new component
import { useNavigation  , useFocusEffect} from "@react-navigation/native";

export default function AddDocument({ accessToken }) {
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [type] = useState(CameraType.back);
  const [photoUri, setPhotoUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // New state for image URL

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera access is required to take photos.');
      }
    })();
  }, []);


  useFocusEffect(
    useCallback(() => {
      // Reset all states to default when the screen is focused
      setCamera(null);
      setPhotoUri(null);
      setUploading(false);
      setModalVisible(false);
      setImageUrl(null);
    }, [])
  );

  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setPhotoUri(photo.uri);
      setModalVisible(true);
    }
  };

  const selectImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri); // Ensure correct access to uri
      setModalVisible(true);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const uploadResult = await uploadImageToServer(photoUri);
      setImageUrl(uploadResult.imageUrl); // Set the image URL
      // Alert.alert('Upload Successful');
      setPhotoUri(null);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Upload Failed', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <AddToFolder imageUrl={imageUrl} accessToken={accessToken} />
      ) : (
        <>
          {cameraPermission?.granted ? (
            <Camera style={styles.camera} ref={setCamera} type={type} ratio="16:9">
              <View style={styles.overlay}>
                <TouchableOpacity style={styles.galleryButton} onPress={selectImageFromGallery}>
                  <MaterialIcons name="photo-library" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                  <View style={uploading ? styles.captureInnerButtonActive : styles.captureInnerButton} />
                </TouchableOpacity>
              </View>
            </Camera>
          ) : (
            <View style={styles.noPermissionContainer}>
              <Text style={styles.noPermissionText}>Camera permission not granted</Text>
              <TouchableOpacity onPress={requestCameraPermission} style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}

          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                {photoUri && <Image source={{ uri: photoUri }} style={styles.previewImage} />}
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleUpload}>
                    {uploading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.modalButtonText}>Upload</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  galleryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
  },
  captureButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  captureInnerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  captureInnerButtonActive: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'gray',
    backgroundColor: 'white',
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  noPermissionText: {
    color: 'white',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: '#121212',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#121212',
    fontWeight: 'bold',
  },
});
