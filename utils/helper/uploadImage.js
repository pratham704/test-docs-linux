import axios from 'axios';
import { baseUrl } from '../../api/BaseUrl';

import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage


export const uploadImageToServer = async (imageUri) => {

  const token = await AsyncStorage.getItem("access_token"); // Get access token from AsyncStorage

  if (!imageUri) throw new Error('No image URI provided');

  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Assuming jpeg for simplicity
    name: `SafeDocs_${Date.now().toString()}.jpg`,
  });
  formData.append('type', 'file');
  formData.append('action', 'upload');
  formData.append('timestamp', Date.now().toString());

  try {
    const response = await axios.post(`${baseUrl}/api/v1/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // Add Bearer token
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error uploading image');
  }
};

