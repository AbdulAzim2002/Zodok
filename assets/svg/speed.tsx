import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const Speed = (props: SvgProps) => (
  <Svg
    width={8}
    height={12}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M.092 6.569 6.284.098c.252-.263.66.051.495.38L4.804 4.4c-.11.216.04.476.275.476h2.61c.276 0 .415.349.22.553l-6.195 6.473c-.252.263-.66-.051-.495-.38l1.975-3.924c.109-.216-.041-.475-.275-.475H.311c-.276 0-.415-.35-.22-.554Z"
    />
  </Svg>
)
export default Speed
