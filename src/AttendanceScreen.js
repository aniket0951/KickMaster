import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, FlatList, View, StyleSheet, Image, Dimensions } from 'react-native'
import { ENDPOINTS, Headers, getData, showToast } from './helper/endpoints'
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import VideoPlayer from './VideoPlayer';

function AttendanceScreen({ navigation }) {
  const [access_token, setAccessToken] = useState('');
  const posts = [
    {
      id: '1',
      userName: 'John Doe',
      userImage: 'https://via.placeholder.com/150',
      postTime: '2 hours ago',
      postContent: [
        { type: 'text', content: 'This is a sample post content' },
        {
          type: 'media',
          content: [
            'https://via.placeholder.com/300',
            'https://via.placeholder.com/300/111',
            'https://via.placeholder.com/300/222',
            'https://www.w3schools.com/html/mov_bbb.mp4' // Video URL
          ],
        },
      ],
    },
    {
      id: '2',
      userName: 'Jane Smith',
      userImage: 'https://via.placeholder.com/150',
      postTime: '5 hours ago',
      postContent: [
        { type: 'text', content: 'Another example post with a longer text content.' },
        {
          type: 'media',
          content: [
            'https://via.placeholder.com/300/333',
            'https://via.placeholder.com/300/444',
            'https://www.w3schools.com/html/mov_bbb.mp4' // Video URL
          ],
        },
      ],
    },
  ];
  useEffect(() => {
    getToken()
  }, [])

  const getToken = () => {
    getData("access_token").then(token => {
      if (token) {
        console.log("Getting Token..", token);
        getEvenets(token)
        setAccessToken(token);
        return token
      } else {
        console.log("Token Not Found");
      }
    })
  }

  const getEvenets = (access_token) => {
    if (access_token === '') {
      showToast("Failed to fetch events : " + access_token)
      return
    }
    const headers = Headers(access_token);
    axios
      .get(ENDPOINTS.GET_EVENTS + 0 + "/" + 30, { headers: headers })
      .then(response => {
        if (response.data) {
          console.log("Response fetched : ", response.data);
        } else {
          console.log("Response fetched failed : ", response.data);
        }
        showToast(response.data.message)
      })
      .catch(error => {
        console.log("Error : ", error);
        if (error.response) {
          if (error.response.status == 401) {
            showToast("please make login")
            navigation.navigate('Home');
          }
        }
      })
  }

  const renderPostContent = (content) => {
    switch (content.type) {
      case 'text':
        return <Text style={style.postContent}>{content.content}</Text>;
      case 'media':
        return (
          <FlatList
            data={content.content}
            horizontal
            renderItem={({ item }) => (
              item.endsWith('.mp4') ? (
                <Video
                  source={{ uri: item }}
                  style={style.postMedia}
                  controls={true}
                  resizeMode="cover"
                />
              ) : (
                <Image source={{ uri: item }} style={style.postMedia} />
              )
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        );
      default:
        return null;
    }
  };

  

  const Post = ({ post }) => (
    <View style={style.postContainer}>
      <View style={style.postHeader}>
        <Image source={{ uri: post.userImage }} style={style.userImage} />
        <View style={style.userInfo}>
          <Text style={style.userName}>{post.userName}</Text>
          <Text style={style.postTime}>{post.postTime}</Text>
        </View>
      </View>
      {post.postContent.map((content, index) => (
        <View key={index}>{renderPostContent(content)}</View>
      ))}
      <View style={style.postActions}>
        <Icon name="thumbs-up" size={20} style={style.actionIcon} />
        <Icon name="comment" size={20} style={style.actionIcon} />
        <Icon name="share" size={20} style={style.actionIcon} />
      </View>
    </View>
  );
  
  

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <Post post={item} />}
      keyExtractor={(item) => item.id}
      style={style.container}
    />
  )
}
const { width } = Dimensions.get('window');

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  postContainer: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  postContent: {
    fontSize: 14,
    marginBottom: 12,
  },
  postMedia: {
    width: width - 32,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionIcon: {
    color: '#666',
  },
})

export default AttendanceScreen