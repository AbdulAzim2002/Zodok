import { CategoryFill, CategoryLine, DarzFill, DarzLine, ExploreFill, ExploreLine, HomeFill, HomeLine, WishlistFill, WishlistLine } from '@/assets/svg/NavBarIcons';
import { SafeArea } from '@/context/SafeArea';
import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';


export default function TabsLayout() {

  // const {setInset} = useSafeArea();
  // useEffect(()=>{
  //   setInset({insert: false}, {insert: true});
  // })
  const styles = StyleSheet.create({
    iconLable: {
      fontFamily: 'CreatoDisplay',
      fontSize: 12,
      marginTop: 4,
      height: 20,
    }
  });
  return (
      <SafeArea statusBar={false}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {borderTopLeftRadius: 16, borderTopRightRadius: 16, borderTopColor: '#9a9a9a', borderWidth: 1, height: 61, position: 'absolute', bottom: -1, paddingTop: 6, paddingBottom: 0, paddingHorizontal: 24, elevation: 0},
            tabBarActiveTintColor: '#18181b',
            tabBarInactiveTintColor: '#787887',
            sceneStyle: {backgroundColor: 'white'}
          }}
        >
          <Tabs.Screen name="home"
            options={{ 
              tabBarIcon: ({focused, color, size}) => {return focused ? <HomeFill/>:<HomeLine/>},
              tabBarLabel: ({focused, color}) => (<Text style={[{color: color}, styles.iconLable]}>Home</Text>),
            }}
          />
          <Tabs.Screen name="categories" 
            options={{ 
              tabBarIcon: ({focused}) => (focused ? <CategoryFill/>:<CategoryLine/>),
              tabBarLabel: ({focused, color}) => (<Text style={[{color: color}, styles.iconLable]}>Category</Text>),
            }}
          />
          <Tabs.Screen name="explore" 
            options={{ 
              tabBarIcon: ({focused}) => (focused ? <ExploreFill/>:<ExploreLine/>),
              tabBarLabel: ({focused, color}) => (<Text style={[{color: color}, styles.iconLable]}>Explore</Text>),
            }}
          />
          <Tabs.Screen name="dar-z" 
            options={{ 
              tabBarIcon: ({focused}) => (focused ? <DarzFill/>:<DarzLine/>),
              tabBarLabel: ({focused, color}) => (<Text style={[{color: color}, styles.iconLable]}>Dar-Z</Text>),
            }}
          />
          <Tabs.Screen name="whishlist" 
            options={{ 
              tabBarIcon: ({focused}) => (focused ? <WishlistFill/>:<WishlistLine/>),
              tabBarLabel: ({focused, color}) => (<Text style={[{color: color}, styles.iconLable]}>Wishlist</Text>),
            }}
          />
          <Tabs.Screen
            name="bindex"
            options={{
                href: null,
            }}
          />
          <Tabs.Screen
            name="sadHome"
            options={{
                href: null,
            }}
          />
          <Tabs.Screen
            name="homa"
            options={{
                href: null,
            }}
          />
        </Tabs>
      </SafeArea>
  );
}
