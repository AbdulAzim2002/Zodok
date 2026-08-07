import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

type selectorType = {
  sizes: string[],
  setSize: (size: string)=>void,
  colorTypes: {name: string, code: string}[],
  setColor: (color: string)=>void,
  setSizeChartVisibility: (visble: boolean) => void,
  selectedColor: string,
  selectedSize: string,
  varientObject: any
}

export const ProductVarientSelector = ({selectedColor, selectedSize, sizes, setSize, colorTypes, setColor, setSizeChartVisibility, varientObject}: selectorType) => {
  const allSizes = sizes[0] && sizes.length > 0 ? 
    (Number.isNaN(Number(sizes[0])) ? ['S', 'M', 'L', 'XL'] :
    (Number(sizes[0]) > 13 ? ['28', '30', '32', '34', '36', '38', '40'] : ['7', '8', '9', '10', '11', '12', '13'])) :
   ['null'];
  if(sizes[0] == 'XS')
    allSizes.unshift('XS');
  if(sizes.at(-1) == 'XXXL')
    allSizes.push(...['XXL', 'XXXL']);
  else if(sizes.at(-1) == 'XXL')
    allSizes.push('XXL');

  return (
    <View>
      {
        (allSizes[0] != 'null') && (
          <>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4}}>
                <Text 
                  style={{
                    fontFamily: 'CreatoDisplay',
                    color: '#18181b',
                    fontSize: 16,
                  }}
                >Select Size</Text>
                <Pressable onPress={()=>{setSizeChartVisibility(true)}}><Text style={{color: '#93939f', fontSize: 16, fontFamily: 'CreatoDisplay'}}><Ionicons size={16} name='shirt-outline'/> View Guide</Text></Pressable>
            </View>
            <View style={{height: 8}}/>
            <View 
              style={{
                padding: 12, 
                borderRadius: 8, 
                borderWidth: 1, 
                backgroundColor: "#fff",
                borderColor: "#f1f1f3"
              }}
            >
                <ScrollView horizontal={true} contentContainerStyle={{gap: 8}}>
                    {
                      allSizes.map((item, index)=>{
                        return Object.hasOwn(varientObject, item) ? (
                          <Pressable
                            key={index}
                            onPress={()=>{
                              setSize(item)
                            }}
                          >
                            <View  
                              style={{
                                padding: 8, 
                                width: 54, 
                                borderRadius: 8, 
                                borderWidth: 1, 
                                borderColor: selectedSize == item ? "#bbb0f1" : "#e4e4e7",
                                backgroundColor: selectedSize == item ? "#eeebfb" : "white"//"#18181B"
                              }}
                            >
                                <Text 
                                  style={{
                                    color: '#110b2c', 
                                    textAlign: 'center', 
                                    fontSize: 14
                                  }}
                                >{item}</Text>
                            </View>
                          </Pressable>
                        ) : (
                          <View 
                            key={index} 
                            style={{
                              padding: 8, 
                              width: 54, 
                              borderRadius: 8, 
                              borderWidth: 1, 
                              backgroundColor: "#e4e4e7", 
                              borderColor: "#c9c9cf", 
                              borderStyle: 'dashed'
                              }}
                            >
                            <Text style={{color: '#484851', textAlign: 'center', fontSize: 14}}>{item}</Text>
                          </View>
                        )
                      })
                    }
                </ScrollView>
            </View>
          </>
        )
      }
      {
        colorTypes.length > 1 && (
          <>
            <View style={{height: 16}}/>
            <Text 
              style={{
                fontFamily: 'CreatoDisplay',
                color: '#18181b',
                fontSize: 16,
              }}
            >Select Color</Text>
            <View style={{height: 8}}/>
            <ScrollView horizontal={true} contentContainerStyle={{gap: 8}}>
              {
                colorTypes.map((item, index)=>{
                  return Object.hasOwn(varientObject[selectedSize], item.name) ? (
                  <Pressable   
                    key={index} 
                    style={{
                      width: 56, 
                      height: 68,
                      borderRadius: 8, 
                      borderWidth: 1, 
                      borderColor: selectedColor == item.name ? "#bbb0f1" : "#e4e4e7",
                      overflow: 'hidden'
                    }}
                    onPress={()=>{setColor(item.name)}}
                  >
                    <View style={{height: 42, backgroundColor: item.code}}/>
                    <View 
                      style={{
                        height: 26, 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        borderTopWidth: 1, 
                        borderTopColor:  selectedColor == item.name ? "#bbb0f1" : "#e4e4e7",
                        backgroundColor: selectedColor == item.name ? "#eeebfb" : "#fff"
                      }}
                    >
                      <Text 
                        style={{
                          textAlign: 'center', 
                          fontFamily:'CreatoDisplay', 
                          fontSize: 14-2*(item.name.length/5-1),
                          color: '#18181b'
                        }}
                      >{item.name}</Text>
                    </View>
                  </Pressable>
                ) : (
                  <View   
                    key={index} 
                    style={{
                      width: 56, 
                      borderRadius: 8, 
                      borderWidth: 1, 
                      borderColor: "#c9c9cf", 
                      borderStyle: 'dashed',
                      overflow: 'hidden'
                    }}
                  >
                    <View style={{height: 42, backgroundColor: item.code}}/>
                    <View 
                      style={{
                        height: 26, 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        borderTopWidth: 1, 
                        borderTopColor:  "#c9c9cf",
                        backgroundColor: "#e4e4e7",
                      }}
                    >
                      <Text 
                        style={{
                          textAlign: 'center', 
                          fontFamily:'CreatoDisplay', 
                          fontSize: 14-2*(item.name.length/5-1),
                          color: '#484851',
                        }}
                      >{item.name}</Text>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          </>
        )
      }
      {
        (allSizes[0] != 'null' || colorTypes.length > 1) &&
        <View style={{height: 24}}/>
      }
    </View>
  )
}