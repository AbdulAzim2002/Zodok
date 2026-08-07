import { TabSVG } from '@/assets/svg/NotchButton';
import CartPopUp from '@/components/cartPopUp';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ListRenderItem, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { createAnimatedComponent, interpolate, interpolateColor, SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('screen');

const headerHeight = 60;
const searchBarHeight = 64;
const cardHeight = (width-64)/3.5;
const heroCardHeight = cardHeight+16;
const heroCanvasHeight = 3*width/8;
const tabHeight = 56;
const noTabs = 2;
const tabWidth = (width-16-(noTabs-1)*8)/noTabs;
const totalHeaderHeight = headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight + tabHeight;

type category = {
  name: string, 
  slug: string, 
  image_url: string | null,
  section: 'male' | 'female',
}

export default function Index() {

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const {primodialCategories} = useAuthContext();

  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  const [currentData, setCurrentData] = useState<category[]>([]);

  const selectedWomenCategory = useRef(0);
  const selectedKidsCategory = useRef(0);
  const selectedMenCategory = useRef(0);
  const [page, setPage] = useState(true);

  useEffect(()=>{
    setCurrentData(primodialCategories.map((item)=>({
      name: item.name, 
      slug: item.slug, 
      image_url: item.imageUrls[page ? 1 : 0], 
      section: page ? 'female' : 'male'})));
  }, [page])

  useEffect(() => {
    womenProgress.value = withSpring(page ? 1 : 0);
    menProgress.value = withSpring(page ? 0 : 1);
    tabPosition.value = withSpring(page ? -(noTabs-1)*(tabWidth) : 0);
  }, [currentData])

  const tabPosition = useSharedValue(-(noTabs-1)*(tabWidth));
  const womenProgress = useSharedValue(1);
  const menProgress = useSharedValue(0);
  const kidsProgress = useSharedValue(0);
  
  const AnimatedLinearGradient = createAnimatedComponent(LinearGradient);

  const womenStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
          womenProgress.value,
          [0, 1],
          ['white', 'black']
      ),
      fontFamily: womenProgress.value < 0.5 ? 'CreatoDisplay' : 'CreatoDisplayMedium',
  }));
  //     color: interpolateColor(
  //         kidsProgress.value,
  //         [0, 1],
  //         ['white', 'black']
  //     ),
  //     fontFamily: kidsProgress.value < 0.5 ? 'CreatoDisplay' : 'CreatoDisplayMedium',
  // }));
  const menStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
          menProgress.value,
          [0, 1],
          ['white', 'black']
      ),
      fontFamily: menProgress.value < 0.5 ? 'CreatoDisplay' : 'CreatoDisplayMedium',
  }));
  const womenImageStyle = useAnimatedStyle(() => ({
      bottom: interpolate(
          womenProgress.value,
          [0, 1],
          [1, 0],
      ),
      height: interpolate(
          womenProgress.value,
          [0, 1],
          [45, 48],
      )
  }));
  //     bottom: interpolate(
  //         kidsProgress.value,
  //         [0, 1],
  //         [1, 0],
  //     ),
  //     height: interpolate(
  //         kidsProgress.value,
  //         [0, 1],
  //         [45, 48],
  //     )
  // }));
  const menImageStyle = useAnimatedStyle(() => ({
      bottom: interpolate(
          menProgress.value,
          [0, 1],
          [1, 0.5],
      ),
      height: interpolate(
          menProgress.value,
          [0, 1],
          [45, 48],
      )
  }));

  const toWomen = () => {
      setPage(true);
  };
  const toMen = () => {
      setPage(false);
  };

  const Header = () => {
      return (
        <View>
          <View style={{height: insets.top}}/>
          <View style={{bottom: tabHeight, width: width, height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight, position: 'absolute', backgroundColor: 'white'}}>
            <AnimatedLinearGradient
              colors={['#9888e9', '#fcf','#ffebff']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight,
                opacity: womenProgress,
              }}
            />
            <AnimatedLinearGradient
              colors={['#e5ff66', '#ef9']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight,
                opacity: kidsProgress,
              }}
            />
            <AnimatedLinearGradient
              colors={['#7661e2', '#ddd7f8']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight,
                opacity: menProgress,
              }}
            />
          </View>
          <View style={{ marginVertical: 8, marginHorizontal: 16, borderRadius: 12, backgroundColor: '#fff', borderColor: '#c9c9cf', borderWidth: 1, height: 48, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <Ionicons name='search-outline' size={20} color={'#c9c9cf'}/>
            <Link href={{
              pathname: '/search',
              params: {gender: page ? 'female' : 'male'}
            }}>
              <Text style={{color: '#c9c9cf', flex: 1, fontFamily: 'CreatoDisplay', fontSize: 16}}>Search for products</Text>
            </Link>
          </View>
          <View style={{height: tabHeight, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8}}>
            {/* <LinearGradient
              colors={[
                'rgb(255, 252, 252)', 
                'rgba(255, 255, 255, 0.3)', 
                'rgba(255, 255, 255, 0.15)', 
                'rgba(255, 255, 255, 0.075)', 
                'rgba(255, 255, 255, 0.037)', 
                'rgba(255, 255, 255, 0.019)', 
                'rgba(255, 255, 255, 0)',
              ]}
              locations={[
                0.2, 
                0.6,
                0.72,
                0.804,
                0.8628,
                0.904,
                1,
              ]}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: tabHeight,
              }}
            /> */}
            <View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
            <View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
            {/* <View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/> */}
            <Animated.View style={{position: 'absolute', left: tabPosition}}>
              <TabSVG color='#ffffffff' width={width} radius={8} numberOfButtons={noTabs} radius1={16} buttonHeight={48} borderColor='white' gap={8} marginHorizontal={16}/>
              <Animated.View style={{opacity: womenProgress, position:'absolute'}}>
                <TabSVG color='#ffebff' width={width} radius={8} numberOfButtons={noTabs} radius1={16} buttonHeight={48} borderColor='#ddd7f8' gap={8} marginHorizontal={16}/>
              </Animated.View>
              {/* <Animated.View style={{opacity: kidsProgress, position:'absolute'}}>
                <TabSVG color='#ef9' width={width} radius={8} radius1={16} buttonHeight={48} borderColor='#a9cc00' gap={8} marginHorizontal={16}/>
              </Animated.View> */}
              <Animated.View style={{opacity: menProgress, position:'absolute'}}>
                <TabSVG color='#ddd7f8' width={width} radius={8} numberOfButtons={noTabs} radius1={16} buttonHeight={48} borderColor='#bbb0f1' gap={8} marginHorizontal={16}/>
              </Animated.View>
            </Animated.View>
            <View style={{height: tabHeight, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8, position: 'absolute', width: width}}>
              <TouchableOpacity 
                style={{flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
                onPress={toWomen}
              >
                <View style={{height: 40, width: 34}}>
                    <Animated.Image
                        style={[{height: 45, width: 34, position: 'absolute'}, womenImageStyle]}
                        source={require('@assets/images/Woman.png')}
                        resizeMode='center'
                    />
                </View>
                <Animated.Text style={womenStyle}>Women</Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity 
                  style={{flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
                  onPress={toMen}
              >
                  <View style={{height: 40, width: 34}}>
                      <Animated.Image
                          style={[{width: 34, position: 'absolute'}, menImageStyle]}
                          source={require('@assets/images/Men.png')}
                          resizeMode='center'
                      />
                  </View>
                  <Animated.Text style={menStyle}>Men</Animated.Text>
              </TouchableOpacity>
              {/* <TouchableOpacity 
                  style={{flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
                  onPress={toKids}
              >
                  <View style={{height: 40, width: 51}}>
                      <Animated.Image
                          style={[{height: 45, width: 51, position: 'absolute'}, kidsImageStyle]}
                          source={require('@assets/images/Kids.png')}
                          resizeMode='center'
                      />
                  </View>
                  <Animated.Text style={kidsStyle}>Kids</Animated.Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      );
  };

  type categoryTabProps = {
    categories: category[],
    setCategory: (index: number) => void,
    tabPosition: SharedValue<number>,
  }

  const ItemRenderer: ListRenderItem<category> = useCallback(({item})=>(
    <Link 
      href={{
        pathname: '/category/[category]',
        params: { 
          categoryName: item.name,
          category: item.slug,
          section: item.section,
        }
      }}
      style={{flex: 1}}
    >
      <View style={{width: (width-32)/2}}>
        <View style={{ borderRadius: 8, backgroundColor: '#dddddd', height: (width-32)/2, width: (width-32)/2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
          {
            item.image_url ?
            <Image src={item.image_url} style={{width: '100%', height: '100%', resizeMode: 'cover'}}/> :
            <Text>{item.name}</Text>
          }
        </View>
        <View style={{width: (width-32)/2, alignItems: 'center'}}>
          <Text style={{fontFamily: 'CreatoDisplay', fontSize: 14}}>{item.name}</Text>
        </View>
      </View>
    </Link>
  ),[]);

  return (
    <>
      <Header/>
      {
        loading ?
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><Text>Loading...</Text></View> :
        <>
          <FlatList
            data={currentData}
            renderItem={ItemRenderer}
            // ListHeaderComponent={()=>(<Carousel>
            //   {
            //     products.map((item, index)=>(
            //       <ProductCard
            //         key={index}
            //         productName={item.name}
            //         originalPrice={item.originalPrice}
            //         discountedPrice={item.price}
            //         imageUrl={item.image}
            //         brandName={item.brand}
            //       />
            //     ))
            //   }
            // </Carousel>)}
            ItemSeparatorComponent={()=>(<View style={{height: 8}}/>)}
            columnWrapperStyle={{gap: 8, paddingHorizontal: 8}}
            ListFooterComponent={()=>(<View style={{height: 8}}/>)}
            // getItemLayout={(data, index) => (
            //   {length: (width-32)/2, offset: 200 * index, index}
            // )}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <CartPopUp />
          <View style={{height: 60, backgroundColor: '#fff'}}/>
        </>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    marginTop: 12,
  },
  mainBanner: {
    width: 320,
    height: 160,
    backgroundColor: '#D3D3D3',
    borderRadius: 16,
    marginHorizontal: 16,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: 88,
    height: 100,
    backgroundColor: '#D3D3D3',
    borderRadius: 12,
    marginRight: 12,
  },
  productsContainer: {
    marginTop: 16,
    paddingBottom: 20,
  },
  productsContent: {
    paddingHorizontal: 16,
  },
  productCard: {
    // width: 160,
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    // marginRight: 12,
    overflow: 'hidden',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    gap: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  productImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  showOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 4,
  },
  showOptionsText: {
    fontSize: 12,
    color: '#666',
  },
  productInfo: {
    padding: 12,
  },
  brandText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryTime: {
    fontSize: 11,
    color: '#9B59B6',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    color: '#999',
  },
  navTextActive: {
    color: '#9B59B6',
    fontWeight: '600',
  },
});

type product = {
    id: number,
    brand: string,
    name: string,
    price: number,
    originalPrice: number,
    discount: string,
    delivery: string,
    image: string,
}

const products = [
    {
      id: 1,
      brand: 'Diamondlady',
      name: 'Bailey Summer Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://diamondlady.in/cdn/shop/files/DB6817D6-2762-4B36-8468-ECCD18210791.jpg?v=1715339477&width=1946',
    },
    {
      id: 2,
      brand: 'Burger Bae',
      name: 'Turquoise Floral handpainted Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://ambraee.com/cdn/shop/files/JBL07377.jpg?v=1736702436&width=1080',
    },
    {
      id: 3,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHJlc3N8ZW58MHx8MHx8fDA%3D',
    },
    {
      id: 2,
      brand: 'Picsum',
      name: 'Lorem Picsum',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://picsum.photos/200/300',
    },
    {
      id: 4,
      brand: 'Burger Bae',
      name: 'Long Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://www.newyorkdress.com/cdn/shop/files/CD803_EGGPLANT_FRONT_1200x.jpg?v=1757696158',
    },
    {
      id: 5,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://zodok.in/cdn/shop/files/1_572cdd1e-fdae-41cd-a202-ffb51f0611de.webp?v=1765990842',
    },
    {
      id: 6,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://zodok.in/cdn/shop/files/3_4b743b8f-9f0d-406b-8196-860c54b05508.webp?v=1765991219',
    },
    {
      id: 7,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://zodok.in/cdn/shop/files/1.webp?v=1765987700',
    },
    {
      id: 8,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://zodok.in/cdn/shop/files/3_3e4f03ca-188e-46e7-939b-a4c1b200ad4b.webp?v=1765991138',
    },
    {
      id: 9,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://zodok.in/cdn/shop/files/Untitled_8d7092ce-72cd-4265-a441-ad5cfa2ef395.webp?v=1765285692',
    },
    {
      id: 10,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://zodok.in/cdn/shop/files/Untitled_9e931ee7-d4a6-4627-a374-ef6d8a16b4b8.webp?v=1764596933',
    },
    {
      id: 11,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://zodok.in/cdn/shop/files/1_91ea949f-d455-4e7f-9fe8-ece3c1f621b1.webp?v=1765991331',
    },
    {
      id: 12,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://zodok.in/cdn/shop/files/71DKTjVSBtL._SY741_2616d624-82bd-446b-8a4c-50459b8c3a3d.jpg?v=1763295329',
    },
    {
      id: 13,
      brand: 'Burger Bae',
      name: 'Red Floral Dress',
      price: 1999,
      originalPrice: 3999,
      discount: '50% Off',
      delivery: '60 Mins Delivery',
      image: 'https://zodok.in/cdn/shop/files/Untitled_82c8877d-21eb-4b4c-8591-9722fede544a.webp?v=1765288404',
    },
];