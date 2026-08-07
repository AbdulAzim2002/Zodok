import { CartIconWithBagde } from "@/assets/svg/cartIcon";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Text, View } from "react-native";

export default function CartIcon() {
  const {cart} = useAuthContext();
  return (
    <View>
      <CartIconWithBagde/>
      <View
        style={{position: 'absolute', top: 9, right: 9, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}}
      >
        <Text style={{position: 'absolute', fontFamily: 'CreatoDisplay', fontSize: 12, color: '#fff'}}>{cart.length}</Text>
      </View>
    </View>
  )
}