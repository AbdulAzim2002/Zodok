import * as React from "react"
import Svg, {
  Defs,
  Path,
  RadialGradient,
  Rect,
  Stop,
  SvgProps
} from "react-native-svg"

export const CartIconWithBagde = (props: SvgProps) => (
  <Svg
    width={36}
    height={26}
    fill="none"
    {...props}
  >
    <Path
      stroke="#93939F"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.353 25h4.897a2 2 0 0 0 1.98-2.28L22.178 8.204a2 2 0 0 0-1.98-1.72h-1.1M17.353 25H2.75A2 2 0 0 1 .76 22.812L2.127 8.297A2 2 0 0 1 4.12 6.484h14.98M17.352 25l1.745-18.516"
    />
    <Path
      stroke="#93939F"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M7.098 10.151v-5.66a3.49 3.49 0 1 1 6.982 0v5.66"
    />
    <Path
      stroke="#93939F"
      strokeWidth={1.5}
      d="M10.59 6.697V4.491a3.49 3.49 0 1 1 6.981 0v2.206"
    />
    <Rect width={18} height={18} x={17.555} fill="#5439DB" rx={9} />
    <Rect  width={18} height={18} x={17.555} fill="url(#a)" rx={9} />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-7.24957 19.7141 -43.8686 -16.5572 29.989 .605)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.6} stopColor="#FAF" />
        <Stop offset={1} stopColor="#E4E4E7" />
      </RadialGradient>
    </Defs>
  </Svg>
)

export const CartIcon = (props: SvgProps) => (
  <Svg
    width={36}
    height={26}
    fill="none"
    {...props}
  >
    <Path
      stroke="#93939F"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.353 24.75h4.897a2 2 0 0 0 1.98-2.28L22.178 7.954a2 2 0 0 0-1.98-1.72h-1.1M17.353 24.75H2.75a2 2 0 0 1-1.99-2.188L2.126 8.047A2 2 0 0 1 4.12 6.234h14.98M17.352 24.75l1.745-18.516"
    />
    <Path
      stroke="#93939F"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M7.098 9.901v-5.66a3.49 3.49 0 1 1 6.982 0V9.9"
    />
    <Path
      stroke="#93939F"
      strokeWidth={1.5}
      d="M10.59 6.447V4.241a3.491 3.491 0 0 1 6.981 0v2.206"
    />
  </Svg>
)

