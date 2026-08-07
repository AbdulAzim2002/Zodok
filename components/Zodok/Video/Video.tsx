import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily } from '../../../shared/';
import { View, Text, Image, ImageSourcePropType, TouchableOpacity, Dimensions, ActivityIndicator} from 'react-native';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import { useEvent, useEventListener } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export function Video({videoSource, closeVideo, onMount, autoPlay, aspectRatio = 16/9, thumbnail} : {videoSource: VideoSource, closeVideo: ()=>void, onMount?: ()=>void, autoPlay?: boolean, aspectRatio?: number, thumbnail?: ImageSourcePropType}) {
	const { tokens, theme } = useTheme();
	const { height, width } = Dimensions.get('window');
	const videoHeight = height/width < aspectRatio ? height-32 : (width-32)*16/9;
	const videoWidth = height/width < aspectRatio ? (height-32)*9/16 : width-32;

	const player = useVideoPlayer(videoSource, player => {
		if(autoPlay)
			player.play();
		if(onMount)
			onMount();
	});

	const { status } = useEvent(player, 'statusChange', { status: player.status});
	const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
	const { muted } = useEvent(player, 'mutedChange', { muted: player.muted });
	const [thumbnailVisible, setThumbnailVisible] = useState(thumbnail ? true : false);

	useEventListener(player, 'playingChange', ({ isPlaying, oldIsPlaying }) => {
		if(!isPlaying) {
			if(Math.floor(player.currentTime) == Math.floor(player.duration))
				closeVideo();
		} else if(thumbnail)
			setThumbnailVisible(false);
		console.log('thumbnail', thumbnail)
	});

	const styles = useThemedStyles((tokens) => ({
		contentContainer: {
			width: '100%',
			height: '100%',
			alignItems: 'center',
			justifyContent: 'center',
		},
		video: {
			width: videoWidth,
			height: videoHeight,
			borderRadius: 16,
		},
		controlIcon: {
			width: 40, 
			height: 40,
			textAlign: 'center',
			paddingTop: 8,
			borderRadius: 100,
			backgroundColor: getColor(tokens, 'bg.input'),
		},
		playIcon: {
			width: 80,
			height: 80,
			paddingLeft: 6,
		},
		tint: {
			width: '100%',
			height: '100%',
			position: 'absolute',
			top: 0,
			left: 0,
			backgroundColor: '#303036',
			opacity: 0.9,
		}
	}));

	return (
		<View style={{height: '100%', width:'100%', position: 'absolute'}}>
			<View style={styles.tint}></View>
			{
				thumbnailVisible &&
				<View style={styles.contentContainer}>
					<View style={styles.video}>
						<Image
							source={thumbnail}
							resizeMode='cover'
							style={styles.video}
							height={videoHeight}
							width={videoWidth}
						/>
					</View>
				</View>
			}
			<View style={styles.contentContainer}>
				<View style={styles.video}>
					<VideoView
						style={styles.video} 
						player={player} 
						contentFit='cover' 
						allowsFullscreen={false}
						allowsPictureInPicture={false}
						nativeControls={false}
						surfaceType={'textureView'}
					/>
				</View>
			</View>
			<View style={[{position: 'absolute'}, styles.contentContainer]}>
				<View style={[styles.video, {justifyContent: 'space-between'}]}>
					<View style={{flexDirection: 'row-reverse', padding: 10}}>
						<TouchableOpacity
							onPress={closeVideo}
						>
							<Ionicons name="close-outline" size={30} color={getColor(tokens, 'text.main')} />
						</TouchableOpacity>
					</View>
					<TouchableOpacity
								onPress={() => {
									if (isPlaying) {
										player.pause();
									} else {
										player.play();
									}
								}}
								style={{flex:1}}
							>
								{
									status === 'loading' ?
									<View style={{alignItems: 'center', justifyContent:'center', flex:1}}>
										<ActivityIndicator
											size={'large'}
											color={'white'}
										/>
									</View> :
									<View style={{alignItems: 'center', justifyContent:'center', flex:1}}>
											{
												!isPlaying &&
												// <Ionicons name="pause-outline" size={24} color={getColor(tokens, 'text.input_placeholder')} style={styles.controlIcon} />
												<Ionicons name="caret-forward-outline" size={60} color={getColor(tokens, 'text.input_placeholder')} style={[styles.controlIcon, styles.playIcon]} />
											}
									</View>
								}
					</TouchableOpacity>
					<View style={{justifyContent: 'space-between', flexDirection: 'row-reverse', padding: 10}}>
							<TouchableOpacity
								onPress={() => {
									if (muted) {
										player.muted = false;
									} else {
										player.muted = true;
									}
								}}
							>
							{
								muted ?
								<Ionicons name="volume-mute-outline" size={24} color={getColor(tokens, 'text.input_placeholder')} style={styles.controlIcon} /> :
								<Ionicons name="volume-high-outline" size={24} color={getColor(tokens, 'text.input_placeholder')} style={styles.controlIcon} />
							}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	)
}