import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');

export default function ProfilePage() {
    const { bottom, top } = useSafeAreaInsets();
    const { profile: { user } } = useAuthContext();

    const signOut = async () => {
        const { error } = await supabase.auth.signOut({ scope: 'local' });
        if (error)
            console.log(error)
    }

    return (
        <View style={styles.background}>
            <ScrollView
                contentContainerStyle={{
                    minHeight: height+top,
                    justifyContent: 'space-between',
                }}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <View style={{ height: top + 14 }} />

                    {/* User Info */}
                    <View style={styles.userRow}>
                        <View style={styles.avatarWrapper}>
                            <Ionicons name='person' size={30} color={'#1A1A1A'} />
                        </View>
                        <View style={{ width: 12 }} />
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={styles.nameStyle}>{user.user_metadata.name}</Text>
                            <Text style={styles.emailStyle}>{user.email}</Text>
                        </View>
                    </View>

                    <View style={{ height: 28 }} />

                    {/* Quick Actions */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Pressable onPress={() => { router.push('/profile/orders') }}>
                            <View style={styles.box}>
                                <View style={styles.boxIconWrapper}>
                                    <Ionicons name='cube-outline' size={30} color={'#1A1A1A'} />
                                </View>
                                <Text style={styles.boxText}>Orders</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => { router.push('/profile/whishlist') }}>
                            <View style={styles.box}>
                                <View style={styles.boxIconWrapper}>
                                    <Ionicons name='heart-outline' size={30} color={'#1A1A1A'} />
                                </View>
                                <Text style={styles.boxText}>Wishlist</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => { router.push('/profile/help') }}>
                            <View style={styles.box}>
                                <View style={styles.boxIconWrapper}>
                                    <Ionicons name='chatbox-ellipses-outline' size={30} color={'#1A1A1A'} />
                                </View>
                                <Text style={styles.boxText}>Help</Text>
                            </View>
                        </Pressable>
                    </View>

                    <View style={{ height: 24 }} />

                    {/* Menu List */}
                    <View style={styles.contentContainer}>
                        <Pressable onPress={() => { router.push('/profile/coupon') }}>
                            <View style={styles.content}>
                                <View style={styles.contentLeft}>
                                    <View style={styles.rowIconWrapper}>
                                        <Ionicons name='ticket-outline' size={20} color={'#1A1A1A'} />
                                    </View>
                                    <Text style={styles.contentText}>Coupon</Text>
                                </View>
                                <Ionicons name='chevron-forward' size={18} color={'#B0B0B5'} />
                            </View>
                        </Pressable>
                        <View style={styles.contentSeperator} />
                        <Pressable onPress={() => { router.push('/profile/editProfile') }}>
                            <View style={styles.content}>
                                <View style={styles.contentLeft}>
                                    <View style={styles.rowIconWrapper}>
                                        <Ionicons name='person-circle-outline' size={24} color={'#1A1A1A'} />
                                    </View>
                                    <Text style={styles.contentText}>Profile</Text>
                                </View>
                                <Ionicons name='chevron-forward' size={18} color={'#B0B0B5'} />
                            </View>
                        </Pressable>
                        <View style={styles.contentSeperator} />
                        <Pressable onPress={() => { router.push('/profile/address') }}>
                            <View style={styles.content}>
                                <View style={styles.contentLeft}>
                                    <View style={styles.rowIconWrapper}>
                                        <Ionicons name='location-outline' size={22} color={'#1A1A1A'} />
                                    </View>
                                    <Text style={styles.contentText}>Saved Address</Text>
                                </View>
                                <Ionicons name='chevron-forward' size={18} color={'#B0B0B5'} />
                            </View>
                        </Pressable>
                    </View>
                </View>

                <Pressable onPress={signOut} style={{ marginBottom: bottom || 8}}>
                    <View style={styles.logoutButton}>
                        <Ionicons name='log-out-outline' size={18} color={'#FF3B30'} />
                        <Text style={styles.logoutText}>Log out</Text>
                    </View>
                </Pressable>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        flex: 1
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameStyle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    emailStyle: {
        fontSize: 13,
        color: '#8E8E93',
    },
    box: {
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: (width - 64) / 3,
        width: (width - 64) / 3,
        backgroundColor: '#F9F9FB',
    },
    boxIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    boxText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    contentContainer: {
        borderRadius: 16,
        backgroundColor: '#F9F9FB',
        paddingHorizontal: 14,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
    },
    contentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EDEDEF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    contentSeperator: {
        width: '100%',
        height: 1,
        backgroundColor: '#E9E9EC'
    },
    contentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A'
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 8,
        backgroundColor: '#fed3d3',
        marginVertical: 8,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FF3B30',
        marginLeft: 8,
    }
})