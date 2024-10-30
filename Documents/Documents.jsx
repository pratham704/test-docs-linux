import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import SkletonLoaderDocument from "../components/Skleton/SkeletonLoaderDocument";
import { baseUrl } from "../api/BaseUrl";
import NoDocuments from "./NoDocuments";
import { Swipeable } from "react-native-gesture-handler";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Documents = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [documentsData, setDocumentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opacity] = useState(new Animated.Value(0));
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchDocuments();
    }, [])
  );

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        const response = await axios.get(
          `${baseUrl}/api/v1/folder/getAllDocsDetails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success) {
          setDocumentsData(response.data.data);
        } else {
          console.error("Failed to fetch documents:", response.data.message);
        }
      } else {
        console.error("No access token found");
      }
    } catch (error) {
      console.error("Error fetching documents:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderPress = (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedFolder(selectedFolder === item ? null : item);
  };

  const handleDownloadImage = async (url) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Media library permission is required to save images.");
        return;
      }
      const fileUri = `${FileSystem.documentDirectory}${Math.random()
        .toString(36)
        .substring(7)}.jpg`;
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const { uri } = await downloadResumable.downloadAsync();
      await MediaLibrary.createAssetAsync(uri);
      alert("Image downloaded successfully");
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Download failed.");
    }
  };

  const openImagePreview = (image) => {
    setSelectedImage(image);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeImagePreview = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };

  const confirmDeleteFolder = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("access_token");
      const responsee = await axios.post(
        `${baseUrl}/api/v1/folder/deleteFolder`,
        { data: { folderName: folderToDelete.folderName } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      

      console.log(responsee.data)
      // setDocumentsData((prevData) =>
      //   prevData.filter((item) => item !== folderToDelete)
      // );
      setDeleteModalVisible(false);
      alert("Folder deleted successfully.");

      fetchDocuments()
      setLoading(false)
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Folder deletion failed.");
    }
  };

  const openDeleteModal = (item) => {
    setFolderToDelete(item);
    setDeleteModalVisible(true);
  };

  if (loading) {
    return <SkletonLoaderDocument />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) +
      " " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const filteredDocuments = documentsData.filter((item) =>
    item.folderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#ffffff" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search documents..."
          placeholderTextColor="#aaaaaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredDocuments.length === 0 ? (
          <NoDocuments />
        ) : (
          <>
            {filteredDocuments.map((item, index) => (
              <Swipeable
                key={index}
                onSwipeableRightOpen={() => openDeleteModal(item)}
              >
                <TouchableOpacity
                  style={styles.folder}
                  onPress={() => handleFolderPress(item)}
                  onLongPress={() => openDeleteModal(item)}
                >
                  <Ionicons name="folder-outline" size={24} color="#ffffff" style={styles.icon} />
                  <Text style={styles.folderText}>{item.folderName}</Text>
                  <Ionicons
                    name={selectedFolder === item ? "chevron-up-outline" : "chevron-down-outline"}
                    size={24}
                    color="#ffffff"
                  />
                </TouchableOpacity>
                {selectedFolder === item && (
                  <View style={styles.imageContainer}>
                    {item.images.map((image, imgIndex) => (
                      <TouchableOpacity
                        key={imgIndex}
                        style={styles.imageWrapper}
                        onPress={() => openImagePreview(image)}
                      >
                        <View style={styles.dropdownItem}>
                          <Image source={{ uri: image.url }} style={styles.smallImage} />
                          <View style={styles.dropdownTextContainer}>
                            <Text style={styles.imageDescription}>{image.description}</Text>
                            <Text style={styles.uploadTime}>{formatDate(image.createdAt)}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </Swipeable>
            ))}
          </>
        )}
      </ScrollView>


            {/* Modal for Enlarged Image */}
            <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={closeImagePreview}>
          <SafeAreaView style={styles.modalBackground}>
            <Animated.View style={[styles.modalContent, { opacity }]}>
              <View style={styles.topRightButtons}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeImagePreview}
                >
                  <Ionicons name="close-outline" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownloadImage(selectedImage.url)}
                >
                  <Ionicons name="download-outline" size={30} color="#fff" />
                </TouchableOpacity>
              </View>

              <Image
                source={{ uri: selectedImage?.url }}
                style={styles.fullScreenImage}
              />
              <View style={styles.descriptionContainer}>
                <Text style={styles.enlargedImageDescription}>
                  {selectedImage?.description || ""}
                </Text>
              </View>
            </Animated.View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={deleteModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground1}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalText1}>Are you sure you want to delete this folder?</Text>
            <View style={styles.modalButtons1}>
              <TouchableOpacity style={styles.modalButton1} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.buttonText1}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton1, styles.confirmButton1]} onPress={confirmDeleteFolder}>
                <Text style={styles.buttonText1}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
  },
  folder: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  folderText: {
    fontSize: 18,
    color: "#ffffff",
    flex: 1,
    marginLeft: 10,
  },
  imageContainer: {
    marginTop: 10,
  },
  imageWrapper: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  smallImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    resizeMode: "cover",
  },
  dropdownTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  imageDescription: {
    fontSize: 16,
    color: "#ffffff",
  },
  uploadTime: {
    fontSize: 12,
    color: "#aaaaaa",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Darker background for focus
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "90%",
    borderRadius: 10,
    overflow: "hidden",
  },
  topRightButtons: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    zIndex: 1,
  },
  closeButton: {
    marginRight: 15,
  },
  downloadButton: {
    marginRight: 15,
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  descriptionContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: "85%",
    padding: 15,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
  },
  enlargedImageDescription: {
    fontSize: 18,
    color: "#ffffff",
  },
  modalBackground1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent1: {
    width: "80%",
    padding: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText1: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons1: {
    flexDirection: "row",
  },
  modalButton1: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButton1: {
    backgroundColor: "red",
    marginLeft: 10,
  },
  buttonText1: {
    color: "#ffffff",
  },
});

export default Documents;
