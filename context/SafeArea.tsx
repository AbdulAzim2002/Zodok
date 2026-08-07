import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaContextType {
	statusBarHeight: number;
	navBarHeight: number;
	setInset: (statueBarInset: {insert: boolean, color?: string}, navBarInset: {insert: boolean, color?: string}) => void,
}

interface SafeAreaProp {
	children?: ReactNode, 
	styles?: ViewStyle, 
	statusBarStyle?: ViewStyle, 
	navBarStyle?: ViewStyle, 
	navBar?: boolean, 
	statusBar?: boolean,
	navBarColor?: string,
	statusBarColor?: string,
}

const SafeAreaContext = createContext<SafeAreaContextType | undefined>(undefined);

export const SafeArea = (
	{ 
		children, 
		styles, 
		statusBarStyle, 
		navBarStyle, 
		navBar=true, 
		statusBar=true,
		navBarColor,
		statusBarColor,
	} : SafeAreaProp
) => {
	const insets = useSafeAreaInsets();
	const [statusBarHeight, setStatusBarHeight] = useState(statusBar?insets.top:0);
	const [topColor, setTopColor] = useState(statusBarColor || 'white');
	const [navBarHeight, setNavBarHeight] = useState(navBar?insets.bottom:0);
	const [bottomColor, setBottomColor] = useState(navBarColor || 'white');
	const setInset = (statueBarInset: {insert: boolean, color?: string}, navBarInset: {insert: boolean, color?: string}) => {
		setStatusBarHeight(statueBarInset.insert ? insets.top : 0);
		setNavBarHeight(navBarInset.insert ? insets.bottom : 0);
		if(navBarInset.color) 
			setBottomColor(navBarInset.color);
		if(statueBarInset.color)
			setTopColor(statueBarInset.color);
	};
	if(navBar)
		useEffect(()=>{
			setNavBarHeight(insets.bottom);
		}, [insets]);
	if(statusBar)
		useEffect(()=>{
			setNavBarHeight(insets.bottom);
		}, [insets]);
	return(
		<SafeAreaContext.Provider value={{statusBarHeight: insets.top, navBarHeight: insets.bottom, setInset}}>
			<View style={[statusBarStyle, {height: statusBarHeight, width: '100%', backgroundColor: topColor}]}/>
			<View style={[styles && styles, {flex: 1, width:'100%', backgroundColor: 'white'}]}>
				{children}
			</View>
			<View style={[navBarStyle, {height: navBarHeight, width: '100%', backgroundColor: bottomColor}]}/>
		</SafeAreaContext.Provider>
	)
};

export const useSafeArea = () => {
	const context = useContext(SafeAreaContext);
	if (context === undefined) throw new Error('useSafeArea must be used within an SafeArea');
	return context;
};