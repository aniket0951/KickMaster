import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'; // import the specific icons you need
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faPlay, faPause);

const { width } = Dimensions.get('window');

const VideoPlayer = ({ source }) => {
    const [paused, setPaused] = useState(true);
    const videoRef = useRef(null);

    const togglePlayPause = () => {
        setPaused(!paused)
        if (videoRef.current) {
            if (paused) {
                videoRef.current?.refs?.player?.play();
            } else {
                videoRef.current?.refs?.player?.pause();
            }
        }
    };
    const onPlayPausePress = () => {
        setPaused(!paused);
    };

    return (
        <View style={styles.videoContainer}>
            <TouchableOpacity onPress={onPlayPausePress} style={styles.overlayButton}>
                <Video
                    ref={videoRef}
                    source={{ uri: source }}
                    style={styles.video}
                    paused={paused}
                    resizeMode="cover"
                    controls={false} // Custom controls
                />
                <View style={styles.playPauseButton}>
                    {/* <Icon name={paused ? 'play' : 'pause'} size={30} color="#FFF" /> */}
                    <FontAwesomeIcon icon={paused ? faPlay : faPause} size={35} color="white" />

                </View>
                {/* <TouchableOpacity style={styles.playPauseButton}>
                </TouchableOpacity> */}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    videoContainer: {
        position: 'relative',
        width: '100%',
        height: width * 0.56, // 16:9 aspect ratio
        backgroundColor: '#000',
        borderRadius: 8,
        overflow: 'hidden',
    },
    overlayButton: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        ...StyleSheet.absoluteFillObject,
    },
    playPauseButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VideoPlayer;