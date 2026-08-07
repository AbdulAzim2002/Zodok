import { ProductCard } from '@/components';
import CartIcon from '@/components/cartIcon';
import { PopupCart } from '@/components/cartPopUp';
import { ProductImages, ProductVarientSelector } from '@/components/Zodok/Product';
import { SizeChart } from '@/components/Zodok/SizeChart';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useStateContext } from '@/hooks/use-state-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Pressable, PressableStateCallbackType, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

type relatedProductData = {
    name: string,
}

type sizeValues = {
    value: string,
    display_name: string,
}

type color = {
    name: string,
    type: string,
    color: string,
    product_images: {id: string}[],
    is_primary: boolean,
}

type product = {
	id: string,
	name: string,
	slug: string,
    trynbuy: boolean,
    rating: number,
    review_count: number,
    description: string,
    gender: string,
    fit: string,
    material: string,
    fabric: string,
	product_images: {image_url: string}[] | null,
	product_variants: productVarients[],
    category: categories,
}

type productVarients = {
    id: string,
	color: string,
    color_code: string,
	size: string,
	price: number,
	compare_at_price: number,
	stock: number,
}

type categories = {
    id: string,
    name: string,
    slug: string,
    parent_id: string
}

type relatedProduct = {
	id: string,
	name: string,
	slug: string,
	product_images: {image_url: string}[] | null,
	product_variants: productVarients[],
}

type relatedProductVarients = {
	color: string,
	size: string,
	price: number,
	compare_at_price: number,
	stock: number,
}

const data: string[] = [
    'lol',
    'paul',
    'mall',
    'call',
    'ball',
    'doll',
    'dog',
    'god',
    'necko',
]

const {height, width} = Dimensions.get('screen');

export default function ProductPage() {

    const {top, bottom} = useSafeAreaInsets();
    const { product, id, name } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [trialButtonLoading, setTrialButtonLoaing] = useState(false);
    const productData = useRef<product>(null);
    const varientObject = useRef<any>({});
    const sizes = useRef<string[]>([]);
    const colorTypes = useRef<{name: string, code: string}[]>([]);
    const {profile, cart, updateCart,updateTrialCart,  wishlist} = useAuthContext();
    const rootCategory = useState<string>();
    const [cartPopUpVisible, setCartPopUpVisible] = useState<boolean>(false);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedVarientId, setSelectedVarentId] = useState<string>('');
    const [isInCart, setIsInCart] = useState<boolean>(false);
    const [forTrial, setForTrial] = useState<boolean>(false);
    const [productedsLoaded, setProductsLoaded] = useState<boolean>(false);
    const [relatedProducts, setRelatedProducts] = useState<relatedProduct[]>([]);

    useEffect(()=>{
        const getRelatedProducts = async () => {
            setProductsLoaded(false);
            console.log(productData.current?.category.id)
            const { data, error } = await supabase
            .from('products')
            .select(`
                id,
                name,
                slug,
                product_images!inner(image_url),
                product_variants!inner(
                    price,
                    compare_at_price,
                    stock
                )
            `)
            .eq('category_id', productData.current?.category.id)
            .neq('id', productData.current?.id)
            .in('gender', [productData.current?.gender, 'unisex'])
            .order('rating')
            .order('display_order', {
                referencedTable: 'product_variants',
                ascending: true,
            })
            .order('display_order', {
                referencedTable: 'product_images',
                ascending: true,
            })
            .overrideTypes<product[]>();

            if(error) {
                console.log(error);
                setRelatedProducts([]);
            } else {
                setRelatedProducts(data);
            }
            setProductsLoaded(true)
        }
        const getDetails = async () => {
            const { data, error } = await supabase
            .from('products')
            .select(`
                id,
                name,
                slug,
                trynbuy,
                rating,
                review_count,
                description,
                gender,
                fit,
                material,
                fabric,
                product_images(image_url),
                product_variants(
                    id,
                    color,
                    color_code,
                    size,
                    price,
                    compare_at_price,
                    stock
                ),
                category:categories(
                    id,
                    name,
                    slug,
                    parent_id
                )
            `)
            .eq('id', id)
            .order('display_order', {
                referencedTable: 'product_variants',
                ascending: true,
            })
            .order('display_order', {
                referencedTable: 'product_images',
                ascending: true,
            })
            .single()
            .overrideTypes<product>();

            if(error)
                console.error(error)
            else {
                const colorSet = new Set();
                colorTypes.current = [];
                for(const varient of data.product_variants) {
                    if(!Object.hasOwn(varientObject.current, varient.size)) {
                        varientObject.current[varient.size] = {};
                        sizes.current.push(varient.size);
                    }
                    varientObject.current[varient.size][varient.color] = {
                        id: varient.id,
                        price: varient.price,
                        compareAtPrice: varient.compare_at_price,
                        stock: varient.stock
                    };
                    
                    if(!colorSet.has(varient.color)) {
                        colorSet.add(varient.color);
                        colorTypes.current.push({
                            name: varient.color, 
                            code: varient.color_code
                        });
                    }
                }
                productData.current = data;
            }
            await getRelatedProducts();
            setLoading(false);
        };
        getDetails()
    },[]);
    
    useEffect(() => {
        if(Object.keys(varientObject.current).length == 0)
            return;
        const inCart = cart.some(item => item.varient.id == selectedVarientId);
        setIsInCart(inCart)
    }, [selectedVarientId, cart])


    const ProductDetails = useCallback(() => {
        const [sizeChartVisiblility, setSizeChartVisibility] = useState(false);
        const [size, setSize] = useState<string>(sizes.current[0]);
        const [color, setColor] = useState<string>(colorTypes.current[0].name);
        

        

        useEffect(()=>{
            if(!Object.hasOwn(varientObject.current[size],color)) {
                const color = Object.keys(varientObject.current[size])[0];
                setColor(color);
                setSelectedVarentId(varientObject.current[size][color].id);
            } else
                setSelectedVarentId(varientObject.current[size][color].id);
            setSelectedSize(size);
        },[size])

        useEffect(()=>{
            setSelectedColor(color);
            setSelectedVarentId(varientObject.current[size][color].id);
        }, [color])

        return(
            <>
                <ProductImages images={productData.current?.product_images || []} id={String(id)}/>
                <View style={{paddingHorizontal: 16}}>
                    <View style={{height: 16}}/>
                    <View style={{height: 30, flexDirection: 'row'}}>
                        <Text 
                            style={{
                                flex: 1, 
                                textAlign: 'center', 
                                textAlignVertical: 'center', 
                                backgroundColor: "#e6faef", 
                                borderRadius: 8, borderWidth: 1, 
                                borderColor: "#66e09f",
                                color: '#00a34c'
                            }}
                        >
                            Free Delivery
                        </Text>
                        {
                            productData.current?.trynbuy &&
                            (<>
                                <View style={{width: 8}}/>
                                <Text 
                                    style={{
                                        flex: 1, 
                                        textAlign: 'center', 
                                        textAlignVertical: 'center', 
                                        backgroundColor: '#eeebfb', 
                                        borderRadius: 8, borderWidth: 1, 
                                        borderColor: '#9888e9',
                                        color: '#432eaf',
                                    }}
                                >
                                    Try & Buy
                                </Text>
                            </>)
                        }
                    </View>
                    <View style={{height: 16}}/>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexShrink: 1}}>
                            <Text 
                                style={{
                                    color: '#18181b',
                                    fontFamily: 'CreatoDisplayBold',
                                    fontSize: 22
                                }}
                            >{productData.current?.name}</Text>
                            <View style={{flexDirection: 'row', gap: 4}}>
                                <Text 
                                    style={{
                                        color: "#18181b",
                                        fontFamily: 'CreatoDisplay',
                                        fontSize: 18
                                    }}
                                >
                                    ₹{varientObject.current[size][color]?.price}
                                </Text>
                                <Text 
                                    style={{
                                        textDecorationLine: 'line-through', 
                                        fontSize: 14, 
                                        textAlignVertical: 'bottom',
                                        fontFamily: 'CreatoDisplay',
                                        color: "#93939f"
                                    }}
                                >₹{varientObject.current[size][color]?.compareAtPrice}</Text>
                                {
                                    varientObject.current[size][color]?.price < varientObject.current[size][color]?.compareAtPrice &&
                                    <Text 
                                        style={{
                                            fontSize: 14, 
                                            textAlignVertical: 'bottom',
                                            fontFamily: 'CreatoDisplay',
                                            color: "#00a34c"
                                        }}
                                    >{(100 - varientObject.current[size][color]?.price/varientObject.current[size][color]?.compareAtPrice*100).toFixed(0)}% Off</Text>
                                }
                            </View>
                        </View>
                        <View style={{alignItems: 'flex-end', gap: 4}}>
                            <View
                                style={{
                                    backgroundColor:'#ffebff', 
                                    borderRadius: 4, 
                                    paddingHorizontal: 6, 
                                    paddingVertical: 4,
                                    height: 24,
                                    width: 49,
                                    flexDirection: 'row',
                                    gap: 4,
                                    alignItems: 'center'
                                }}
                            >
                                <Ionicons name='star' color={'#cca3cc'}/>
                                <Text 
                                    style={{
                                        fontFamily: 'CreatoDisplay', 
                                        color: '#332933',
                                        textAlign: 'center'
                                    }}
                                >
                                    {productData.current?.rating.toFixed(1)}
                                </Text>
                            </View>
                            <Text 
                                style={{
                                    color: "#665266",
                                    fontFamily: 'CreatoDisplay',
                                }}
                            >({productData.current?.review_count})</Text>
                        </View>
                    </View>
                    {/* <View style={{height: 16}}/>
                    <View style={{padding: 12, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', gap: 8}}>
                            <Percentage/>
                            <View>
                                <Text>Get this at Rs. 130</Text>
                                <Text>Use OSWIN</Text>
                            </View>
                        </View>
                        <View style={{padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#f1f1f3'}}>
                            <Ionicons name='copy-outline' size={22}/>
                        </View>
                    </View> */}
                    <View style={{height: 24}}/>
                    <ProductVarientSelector 
                        colorTypes={colorTypes.current}
                        setColor={setColor}
                        sizes={sizes.current}
                        setSize={setSize}
                        setSizeChartVisibility={setSizeChartVisibility}
                        selectedColor={color}
                        selectedSize={size}
                        varientObject={varientObject.current}
                    />
                    <Text
                        style={{
                            fontFamily: 'CreatoDisplay',
                            color: '#18181b',
                            fontSize: 16,
                        }}
                    >Description</Text>
                    <View style={{height: 16}}/>
                    <Text style={{fontFamily: 'CreatoDisplay', color: '#787887'}}>{productData.current?.description}</Text>
                    <View style={{height: 24}}/>
                    <Text
                        style={{
                            fontFamily: 'CreatoDisplay',
                            color: '#18181b',
                            fontSize: 16,
                        }}
                    >Product Details</Text>
                    <View style={{height: 16}}/>
                    <View style={{gap: 8}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontFamily: 'CreatoDisplay', color: '#787887'}}>Gender</Text><Text style={{fontFamily: 'CreatoDisplay', color: '18181b'}}>{(productData.current?.gender || "NA").replace(/(^\w|\s\w)/g, match => match.toUpperCase())}</Text>
                        </View>
                        {
                            color &&
                            <>
                                <View style={{ width: '100%', borderTopWidth: 1, borderColor: '#f1f1f3'}}/>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{fontFamily: 'CreatoDisplay', color: '#787887'}}>Color</Text><Text style={{fontFamily: 'CreatoDisplay', color: '18181b'}}>{color.replace(/(^\w|\s\w)/g, match => match.toUpperCase())}</Text>
                                </View>
                            </>
                        }
                        {
                            size &&
                            <>
                                <View style={{ width: '100%', borderTopWidth: 1, borderColor: '#f1f1f3'}}/>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{fontFamily: 'CreatoDisplay', color: '#787887'}}>Size</Text><Text style={{fontFamily: 'CreatoDisplay', color: '18181b'}}>{size.replace(/(^\w|\s\w)/g, match => match.toUpperCase())}</Text>
                                </View>
                            </>
                        }
                        {
                            productData.current?.fit &&
                            <>
                                <View style={{ width: '100%', borderTopWidth: 1, borderColor: '#f1f1f3'}}/>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{fontFamily: 'CreatoDisplay', color: '#787887'}}>Fit</Text><Text style={{fontFamily: 'CreatoDisplay', color: '18181b'}}>{productData.current?.fit.replace(/(^\w|\s\w)/g, match => match.toUpperCase())}</Text>
                                </View>
                            </>
                        }
                        {
                            productData.current?.material && 
                            <>
                                <View style={{ width: '100%', borderTopWidth: 1, borderColor: '#f1f1f3'}}/>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{fontFamily: 'CreatoDisplay', color: '#787887'}}>Material</Text><Text style={{fontFamily: 'CreatoDisplay', color: '18181b'}}>{productData.current?.material.replace(/(^\w|\s\w)/g, match => match.toUpperCase())}</Text>
                                </View>
                            </>
                        }
                        {
                            productData.current?.fabric &&
                            <>
                                <View style={{ width: '100%', borderTopWidth: 1, borderColor: '#f1f1f3'}}/>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{fontFamily: 'CreatoDisplay', color: '#787887'}}>Fabric</Text><Text style={{fontFamily: 'CreatoDisplay', color: '18181b'}}>{productData.current?.fabric.replace(/(^\w|\s\w)/g, match => match.toUpperCase())}</Text>
                                </View>
                            </>
                        }
                    </View>
                    <View style={{height: 32}}/>
                    {
                        productedsLoaded && relatedProducts.length > 0 &&
                        <>
                            <Text
                                style={{
                                    fontFamily: 'CreatoDisplay',
                                    color: '#787887',
                                    fontSize: 16,
                                }}
                            >Similar to</Text>
                            <View style={{height: 4}}/>
                            <Text
                                style={{
                                    fontFamily: 'CreatoDisplayBold',
                                    color: '#18181b',
                                    fontSize: 22,
                                }}
                            >
                                {name}
                            </Text>
                            <View style={{height: 16}}/>
                        </>
                    }
                    {
                        !productedsLoaded &&
                        <View style={{gap: 8, flexDirection: 'row'}}>
                            <View style={{height: (width-40)*2/3, flex: 1, borderRadius: 8, backgroundColor: 'lightgrey'}}/>
                            <View style={{height: (width-40)*2/3, flex: 1, borderRadius: 8, backgroundColor: 'lightgrey'}}/>
                        </View>
                    }
                </View>
                <SizeChart close={()=>{setSizeChartVisibility(false)}} visible={sizeChartVisiblility}/>
            </>
        )
    },[productedsLoaded]);

    const addToCart = async () => {
        setButtonLoading(true);
        const {error} = await supabase
        .from('cart_items')
        .insert({
            user_id: profile.user.id,
            variant_id: varientObject.current[selectedSize][selectedColor] && varientObject.current[selectedSize][selectedColor].id,
            quantity: 1,
        })

        if(error)
            console.log(error)
        else {
            updateCart(profile.user.id);
            setIsInCart(true);
        }
        setButtonLoading(false);
    }

    
    const relatedProductRenderer = ({item}: {item:relatedProduct}) => {
        const cardWidth = (width-40)/2;
        return (
            <ProductCard
                productId={item.id}
                cardWidth={cardWidth}
                isWishlisted={wishlist.includes(item.id)}
                imageUrl={item.product_images ? item.product_images[0].image_url : ''}
                productName={item.name}
                originalPrice={item.product_variants[0].compare_at_price}
                discountedPrice={item.product_variants[0].price}
                onPress={()=>{
                    router.push({
                        pathname: '/product/[product]',
                        params: {
                            product: item.slug,
                            name: item.name,
                            id: item.id,
                        }
                    })

                }}
            />
        )
    }

    return(
        <View 
            style={{
                height: '100%',
                width: '100%',
                backgroundColor: "#FFF",
                paddingTop: top
            }}
        >
            <StatusBar style='dark'/>
            {
                loading ?
                <View style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <ActivityIndicator size='large' />
                </View> :
                <>
                    <FlatList
                        data={relatedProducts}
                        renderItem={relatedProductRenderer}
                        ListHeaderComponent={ProductDetails}
                        ListFooterComponent={()=>(<View style={{height: 8}}/>)}
                        ItemSeparatorComponent={()=>(<View style={{height: 8}}/>)}
                        columnWrapperStyle={{gap: 8, paddingHorizontal: 16}}
                        // getItemLayout={(data, index) => (
                        //     {length: 200, offset: 200 * index, index}
                        // )}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        // refreshControl={
                        //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        // }
                    />
                    <Footer
                        trialButtonLoading={trialButtonLoading}
                        isInCart={isInCart}
                        buttonLoading={buttonLoading}
                        addToCart={addToCart}
                        cartEmpty={cart.length < 1}
                    />
                </>
            }
        </View>
    );
}

const Footer = ({
    isInCart, 
    buttonLoading, 
    addToCart,
    cartEmpty,
}: {
    trialButtonLoading: boolean, 
    isInCart: boolean, 
    buttonLoading: boolean, 
    cartEmpty: boolean
    addToCart: () => Promise<void>
}) => {
    const {bottom, top} = useSafeAreaInsets();
    const paddongBottom = Math.max(bottom, 32);
    const {cart} = useAuthContext();
    const {trynbuy} = useStateContext();
    const buttonWidth = (width-40)/2;
    const footerOffset = useSharedValue(isInCart ? 0 : -(buttonWidth+8));
    const overlayOffset = useSharedValue(!cartEmpty ? 0 : 50 + paddongBottom);
    const actualFooterOffset = useSharedValue(0)
    const [total, setTotal] = useState(0);
    const [trialTotal, setTrialTotal] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [footerHeight, setFooterHeight] = useState(50 + paddongBottom);
    const [cartPopUpVisible, setCartPopUpVisible] = useState(false);

    useEffect(() => {
        setTimeout(()=>{actualFooterOffset.value = withSpring(50+paddongBottom)}, 550)
    }, [])

    useEffect(() => {
        footerOffset.value = withSpring(isInCart ? 0 : -(buttonWidth+8));
    }, [isInCart])

    useEffect(() => {
        let subtotal = 0, total = 0, trialTotal = 0;
        for(const item of cart) {
            total += item.quantity * item.varient.price;
            subtotal += item.quantity * item.varient.compare_at_price;
            if(!item.varient.info.trynbuy)
                trialTotal += item.quantity * item.varient.price;
        }
        setTrialTotal(trialTotal);
        setSubtotal(subtotal);
        setTotal(total);
    }, [cart])

    useEffect(() => {
        if(cart.length < 1)
            overlayOffset.value = withSpring(0);
        else
            overlayOffset.value = withSpring(footerHeight);
    }, [footerHeight, cart])
    
    return (
        <Animated.View style={{width, height: actualFooterOffset}}>
            <View
                style={{
                    // paddingHorizontal: 16,
                    flexDirection: 'row',
                    paddingTop: 8, 
                    paddingBottom: bottom > 32 ? bottom : 32,
                    borderTopWidth: 1,
                    borderColor: '#e4e4e7',
                    width,
                    backgroundColor: "#fff",
                }}
                onLayout={({nativeEvent:{layout}})=>{setFooterHeight(layout.height)}}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        width: 16,
                        height: 42
                    }}
                />
                <Animated.View
                    style={{
                        flexDirection: 'row', 
                        gap: 8, 
                        left: footerOffset,
                        width: width-32
                    }}
                >
                    <View 
                        style={{
                            height: 42,
                            width:buttonWidth,
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{flexDirection: 'row', gap: 4}}>
                            <Text
                                style={{
                                    color: '#787887',
                                    fontFamily: "CreatoDisplay",
                                    fontSize: 16,
                                }}
                            >
                            Subtotal
                            </Text>
                            {
                                trynbuy &&
                                <Text 
                                    style={{
                                        color: '#00a34c', 
                                        fontFamily: 'CreatoDisplayMedium', 
                                        verticalAlign:'bottom', 
                                        fontSize: 14
                                    }}
                                >
                                    TRY & BUY
                                </Text>
                            }
                        </View>
                        <View style={{flexDirection: 'row', gap: 4}}>
                            <Text
                                style={{
                                    color: '#18181b',
                                    fontFamily: "CreatoDisplay",
                                    fontSize: 18,
                                }}
                            >
                                ₹{trynbuy ? trialTotal : total}
                            </Text>
                            <Text
                                style={{
                                    textDecorationLine: 'line-through', 
                                    fontSize: 14, 
                                    textAlignVertical: 'bottom',
                                    fontFamily: 'CreatoDisplay',
                                    color: "#93939f"
                                }}
                            >
                                ₹{subtotal}
                            </Text>
                        </View>
                    </View>
                    <Button 
                        label={'View Cart'}
                        Icon={CartIcon}
                        buttonStyle={{
                            width: buttonWidth,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            backgroundColor: "white",
                            height: 42,
                            borderWidth: 1,
                            borderColor: '#e4e4e7',
                            flexDirection: 'row',
                            gap: 10,

                        }}
                        disableButtonStyle={{
                            backgroundColor: "#93939F"
                        }}
                        onPressedButtonStyle={{
                            opacity: 0.8
                        }}
                        labelStyle={{
                            color: '#18181b',
                            fontFamily: "CreatoDisplay",
                            fontSize: 16,
                        }}
                        disabledLabelStyle={{color: "#484851"}}
                        onPress={()=>{setCartPopUpVisible(true)}}
                        disabled={cart.length < 1}
                    />
                    <Button 
                        label={'Add to Cart'}
                        buttonStyle={{
                            width: buttonWidth,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            backgroundColor: "#5439DB",
                            height: 42,
                        }}
                        disableButtonStyle={{
                            backgroundColor: "#93939F"
                        }}
                        onPressedButtonStyle={{
                            opacity: 0.8
                        }}
                        labelStyle={{
                            color: "#FFF",
                            fontFamily: "CreatoDisplay",
                            fontSize: 16,
                        }}
                        disabledLabelStyle={{color: "#484851"}}
                        loading={buttonLoading}
                        onPress={addToCart}
                    />
                </Animated.View>
                <View
                    style={{
                        backgroundColor: '#fff',
                        width: 16,
                        height: 42
                    }}
                />
                <Animated.View
                    style={{
                        position: 'absolute',
                        flexDirection: 'row',
                        paddingTop: 8, 
                        paddingHorizontal: 16,
                        paddingBottom: bottom > 32 ? bottom : 32,
                        backgroundColor: 'white',
                        width,
                        top: overlayOffset
                    }}

                >
                    <Button 
                        label={'Add to Cart'}
                        buttonStyle={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            backgroundColor: "#5439DB",
                            height: 42,
                        }}
                        disableButtonStyle={{
                            backgroundColor: "#93939F"
                        }}
                        onPressedButtonStyle={{
                            opacity: 0.8
                        }}
                        labelStyle={{
                            color: "#FFF",
                            fontFamily: "CreatoDisplay",
                            fontSize: 16,
                        }}
                        disabledLabelStyle={{color: "#484851"}}
                        loading={buttonLoading}
                        onPress={addToCart}
                    />
                </Animated.View>
            </View>
            <PopupCart visible={cartPopUpVisible} onClose={()=>{setCartPopUpVisible(false)}} />
        </Animated.View>
    )
}

const Button = ({
    Icon,
    disabled=false,
    label,
    buttonStyle,
    disableButtonStyle,
    onPressedButtonStyle,
    labelStyle,
    disabledLabelStyle,
    loading=false,
    onPress
} : {
    Icon?: (props: SvgProps) => React.JSX.Element
    disabled?: boolean,
    label: string,
    buttonStyle?: ViewStyle,
    disableButtonStyle?: ViewStyle,
    onPressedButtonStyle?: ViewStyle
    labelStyle?: TextStyle,
    disabledLabelStyle?: TextStyle,
    loading?: boolean,
    onPress: ()=>void;
}) => {
    const defaultStyle: ViewStyle = {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: 40,
            backgroundColor: '#26edff',
            flex: 1
        }
    function containerStyle(state: PressableStateCallbackType): ViewStyle {
        const style: ViewStyle = (disabled ? {...buttonStyle, ...disableButtonStyle} : buttonStyle) || defaultStyle;
        return state.pressed ? {...style, ...onPressedButtonStyle} : style;
    }
    return (
            <Pressable 
                style={containerStyle}
                disabled={disabled || loading}
                onPress={onPress}
            >
                <View style={{height: '100%', width: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
                    {
                        loading && 
                        <ActivityIndicator color={labelStyle?.color}/>
                    }
                </View>
                {Icon && <Icon/>}<Text style={[labelStyle, disabled && disabledLabelStyle, loading && {display: 'none'}]}>{label}</Text>
            </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8, //getBorderRadius(tokens, 'button'),
      paddingHorizontal: 16, //getSpacing(tokens, 'padding.button'),
      gap: 16, //getSpacing(tokens, 'gap.button'),
    },
    small: {
      height: 32,
    },
    medium: {
      height: 40,
    },
    large: {
      height: 48,
    },
    primary: {
      backgroundColor: "#5439DB", //getColor(tokens, 'brand.primary'),
    },
    primaryDisabled: {
      backgroundColor: "#93939F", //getColor(tokens, 'bg.button.neutralmain_disabled'),
    },
    secondary: {
      backgroundColor: "#FFCCFF", //getColor(tokens, 'brand.secondary'),
    },
    secondaryDisabled: {
      backgroundColor: "#484851", //getColor(tokens, 'bg.button.neutralsecondary_disabled'),
    },
    tertiary: {
      backgroundColor: "#D4FF00", //getColor(tokens, 'brand.tertiary'),
    },
    tertiaryDisabled: {
      backgroundColor: "#484851", //getColor(tokens, 'bg.button.neutralsecondary_disabled'),
    },
    neutral: {
      backgroundColor: "#1f1c1c", //getColor(tokens, 'bg.button.neutralmain'),
    },
    neutralDisabled: {
      backgroundColor: "#93939F", //getColor(tokens, 'bg.button.neutralmain_disabled'),
    },
    neutralsecondary: {
      backgroundColor: "#FFF", //getColor(tokens, 'bg.button.neutralsecondary'),
    },
    neutralsecondaryDisabled: {
      backgroundColor: "#484851", //getColor(tokens, 'bg.button.neutralsecondary_disabled'),
    },
    labelPrimary: {
      color: "#FFF", //getColor(tokens, 'text.bg.anydark'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelSecondary: {
      color: "#332933", //getColor(tokens, 'text.bg.secondarylight'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelTertiary: {
      color: "#2A3300", //getColor(tokens, 'text.bg.tertiarylight'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelNeutral: {
      color: "#FFF", //getColor(tokens, 'text.button.neutralmain'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelNeutralsecondary: {
      color: "#000", //getColor(tokens, 'text.button.neutralsecondary'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelDisabled: {
      color: "#484851", //getColor(tokens, 'text.button.neutralmain_disabled'),
      fontSize: 18,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
});