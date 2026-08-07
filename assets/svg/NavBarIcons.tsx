import * as React from "react"
import Svg, {
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  SvgProps,
} from "react-native-svg"


export const HomeLine = (props: SvgProps) => (
  <Svg
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#93939F"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M10.643 1.268a3.591 3.591 0 0 1 3.714 0l8.261 5.021c1.117.68 1.735 1.903 1.617 3.16L23.232 20.18c-.16 1.721-1.653 3.069-3.475 3.069H5.243c-1.822 0-3.314-1.348-3.475-3.07L.765 9.449c-.118-1.256.5-2.48 1.617-3.159l8.26-5.021ZM9.32 11.653a.75.75 0 0 0-.75.75v4.639a.75.75 0 0 0 1.5 0v-4.639a.75.75 0 0 0-.75-.75Zm6.36 0a.75.75 0 0 0-.75.75v4.639a.75.75 0 0 0 1.5 0v-4.639a.75.75 0 0 0-.75-.75Z"
    />
  </Svg>
)

export const HomeFill = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      fillRule="evenodd"
      d="M9.843.627a4.026 4.026 0 0 1 4.314 0l7.93 5.02a4.14 4.14 0 0 1 1.896 3.87L23.02 20.25c-.19 2.124-1.948 3.75-4.053 3.75H5.033C2.928 24 1.17 22.374.98 20.25L.017 9.517a4.14 4.14 0 0 1 1.896-3.87l7.93-5.02Zm-.591 8.582a.769.769 0 0 0-.763.773.77.77 0 0 0 .763.774h4.17l-5.061 6.153a.78.78 0 0 0 .097 1.088.751.751 0 0 0 .633.161.77.77 0 0 0 .161.018h5.495a.769.769 0 0 0 .763-.773.769.769 0 0 0-.763-.773h-4.17l5.061-6.153a.78.78 0 0 0-.098-1.089.751.751 0 0 0-.634-.162.76.76 0 0 0-.159-.017H9.252Z"
      clipRule="evenodd"
    />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-9.66611 26.2856 -58.4917 -22.0764 16.578 .807)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.6} stopColor="#FAF" />
        <Stop offset={1} stopColor="#E4E4E7" />
      </RadialGradient>
    </Defs>
  </Svg>
)

export const CategoryLine = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#93939F"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.2 15.15h3.2c.572 0 .956 0 1.252.025.287.023.424.065.515.111.235.12.427.31.547.546.046.09.088.229.111.516.024.295.025.68.025 1.252v3.2c0 .572 0 .957-.025 1.253-.023.287-.065.424-.111.514a1.25 1.25 0 0 1-.547.546c-.09.046-.228.09-.515.113-.296.024-.68.024-1.253.024H3.2c-.572 0-.957 0-1.253-.024-.287-.024-.424-.067-.514-.113a1.249 1.249 0 0 1-.546-.546c-.046-.09-.09-.227-.113-.514C.75 21.757.75 21.373.75 20.8v-3.2c0-.573 0-.957.024-1.252.024-.287.067-.425.113-.516.12-.235.31-.426.546-.546.09-.046.227-.088.514-.111.296-.024.68-.025 1.253-.025Zm14.4 0h3.2c.572 0 .957 0 1.253.025.287.023.424.065.514.111.235.12.427.31.547.546.046.09.088.229.112.516.024.295.024.68.024 1.252v3.2c0 .572 0 .957-.024 1.253-.024.287-.066.424-.112.514-.12.236-.311.426-.547.546-.09.046-.227.09-.514.113-.296.024-.68.024-1.253.024h-3.2c-.572 0-.957 0-1.252-.024-.287-.024-.424-.067-.515-.113a1.25 1.25 0 0 1-.546-.546c-.046-.09-.089-.227-.112-.514-.024-.296-.025-.68-.025-1.253v-3.2c0-.573 0-.957.025-1.252.023-.287.066-.425.112-.516.12-.235.311-.426.546-.546.09-.046.228-.088.515-.111.296-.024.68-.025 1.253-.025ZM3.2.75h3.2c.572 0 .956 0 1.252.024.287.024.424.067.515.113.235.12.427.31.547.546.046.09.088.228.111.514.024.296.025.68.025 1.253v3.2c0 .572 0 .957-.025 1.252-.023.287-.065.425-.111.516-.12.235-.312.426-.547.546-.09.046-.228.088-.515.111-.296.024-.68.025-1.253.025H3.2c-.572 0-.957 0-1.253-.025-.287-.023-.424-.065-.514-.111a1.25 1.25 0 0 1-.546-.546c-.046-.09-.09-.229-.113-.516C.75 7.357.75 6.972.75 6.4V3.2c0-.572 0-.957.024-1.253.024-.287.067-.424.113-.514.12-.236.31-.426.546-.546.09-.046.227-.09.514-.113C2.243.75 2.627.75 3.2.75Zm14.4 0h3.2c.572 0 .957 0 1.253.024.287.024.424.067.514.113.236.12.427.31.547.546.046.09.088.228.112.514.024.296.024.68.024 1.253v3.2c0 .572 0 .957-.024 1.252-.024.287-.066.425-.112.516-.12.235-.312.426-.547.546-.09.046-.227.088-.514.111-.296.024-.68.025-1.253.025h-3.2c-.572 0-.957 0-1.252-.025-.287-.023-.424-.065-.515-.111a1.25 1.25 0 0 1-.546-.546c-.046-.09-.089-.229-.112-.516-.024-.295-.025-.68-.025-1.252V3.2c0-.572 0-.957.025-1.253.023-.287.066-.424.112-.514.12-.235.31-.426.546-.546.09-.046.228-.09.515-.113.296-.024.68-.024 1.253-.024Z"
    />
  </Svg>
)

export const CategoryFill = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M7.6 0H2a2 2 0 0 0-2 2v5.6a2 2 0 0 0 2 2h5.6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z"
    />
    <Path
      fill="url(#b)"
      d="M22 0h-5.6a2 2 0 0 0-2 2v5.6a2 2 0 0 0 2 2H22a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z"
    />
    <Path
      fill="url(#c)"
      d="M22 14.4h-5.6a2 2 0 0 0-2 2V22a2 2 0 0 0 2 2H22a2 2 0 0 0 2-2v-5.6a2 2 0 0 0-2-2Z"
    />
    <Path
      fill="url(#d)"
      d="M7.6 14.4H2a2 2 0 0 0-2 2V22a2 2 0 0 0 2 2h5.6a2 2 0 0 0 2-2v-5.6a2 2 0 0 0-2-2Z"
    />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-9.66616 26.2855 -58.4919 -22.0762 16.578 .807)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.6} stopColor="#FAF" />
        <Stop offset={1} stopColor="#E4E4E7" />
      </RadialGradient>
      <RadialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-9.66616 26.2855 -58.4919 -22.0762 16.578 .807)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.6} stopColor="#FAF" />
        <Stop offset={1} stopColor="#E4E4E7" />
      </RadialGradient>
      <RadialGradient
        id="c"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-9.66616 26.2855 -58.4919 -22.0762 16.578 .807)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.6} stopColor="#FAF" />
        <Stop offset={1} stopColor="#E4E4E7" />
      </RadialGradient>
      <RadialGradient
        id="d"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-9.66616 26.2855 -58.4919 -22.0762 16.578 .807)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.6} stopColor="#FAF" />
        <Stop offset={1} stopColor="#E4E4E7" />
      </RadialGradient>
    </Defs>
  </Svg>
)

export const ExploreLine = (props: SvgProps) => (
  <Svg
    width={26}
    height={26}
    fill="none"
    {...props}
  >
    <Path
      stroke="#93939F"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m24.75 24.75-5.8-5.8m3.133-7.533c0 5.89-4.775 10.666-10.666 10.666S.75 17.308.75 11.417 5.526.75 11.417.75c5.89 0 10.666 4.776 10.666 10.667Z"
    />
  </Svg>
)

export const ExploreFill = (props: SvgProps) => (
  <Svg
    width={26}
    height={26}
    fill="none"
    {...props}
  >
    <Path
      stroke="url(#a)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m24.75 24.75-5.8-5.8m3.133-7.533c0 5.89-4.775 10.666-10.666 10.666S.75 17.308.75 11.417 5.526.75 11.417.75c5.89 0 10.666 4.776 10.666 10.667Z"
    />
    <Path
      fill="url(#b)"
      d="M11.4 19.65a8.25 8.25 0 1 0 0-16.5 8.25 8.25 0 0 0 0 16.5Z"
    />
    <Path
      fill="#fff"
      fillOpacity={0.5}
      d="M11.4 19.65a8.25 8.25 0 1 0 0-16.5 8.25 8.25 0 0 0 0 16.5Z"
    />
    <Defs>
      <RadialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-6.64543 18.0713 -40.2129 -15.1774 14.547 3.705)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.6} stopColor="#FAF" />
        <Stop offset={1} stopColor="#E4E4E7" />
      </RadialGradient>
      <LinearGradient
        id="a"
        x1={17.75}
        x2={4.75}
        y1={-0.25}
        y2={24.75}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.5} stopColor="#FAF" />
        <Stop offset={1} stopColor="#C9C9CF" />
      </LinearGradient>
    </Defs>
  </Svg>
)

export const DarzLine = (props: SvgProps) => (
  <Svg
    width={24}
    height={26}
    fill="none"
    {...props}
  >
    <Path
      stroke="#93939F"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M16.928 6.019s4.35 1.296 2.88 4.263c-1.472 2.966-13.735 7.416-14.226 11.371-.734 5.924 17.169 1.528 17.169 1.528m-8.34-17.843S7.055 3.855 2.037 8.687m16.82-5.035-2.973 2.996M.813 21.362l14.3-16.728c1.76-2.059 4.054-5.208 5.961-3.287 2.003 2.019-1.442 4.445-3.594 6.3L1.159 21.71c-.23.199-.543-.118-.345-.349Z"
    />
  </Svg>
)

export const DarzFill = (props: SvgProps) => (
  <Svg
    width={23}
    height={25}
    fill="none"
    {...props}
  >
    <Path
      stroke="#5439DB"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M13.923 4.992S6.66 3.54 1.709 8.272"
    />
    <Path
      stroke="url(#a)"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M13.923 4.992S6.66 3.54 1.709 8.272"
    />
    <Path
      fill="url(#b)"
      d="M18.974.014c.67-.075 1.311.15 1.878.717.594.595.817 1.267.72 1.965-.093.662-.465 1.287-.921 1.849-.907 1.114-2.352 2.213-3.375 3.088L1.247 21.337c-.704.601-1.66-.358-1.055-1.06l14.044-16.3c.84-.974 1.889-2.312 2.96-3.14.54-.417 1.141-.752 1.778-.823Zm-.135 2.798a.75.75 0 0 0-1.06 0l-2.934 2.933a.75.75 0 0 0 1.06 1.06l2.934-2.933a.75.75 0 0 0 0-1.06Z"
    />
    <Path
      fill="#fff"
      fillOpacity={0.5}
      d="M18.974.014c.67-.075 1.311.15 1.878.717.594.595.817 1.267.72 1.965-.093.662-.465 1.287-.921 1.849-.907 1.114-2.352 2.213-3.375 3.088L1.247 21.337c-.704.601-1.66-.358-1.055-1.06l14.044-16.3c.84-.974 1.889-2.312 2.96-3.14.54-.417 1.141-.752 1.778-.823Zm-.135 2.798a.75.75 0 0 0-1.06 0l-2.934 2.933a.75.75 0 0 0 1.06 1.06l2.934-2.933a.75.75 0 0 0 0-1.06Z"
    />
    <Path
      stroke="url(#c)"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M15.699 5.63s5.002 1.299 3.55 4.203c-1.453 2.905-13.555 7.262-14.04 11.135-.725 5.8 16.945 1.496 16.945 1.496"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={21.218}
        x2={19.957}
        y1={8.729}
        y2={17.016}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.5} stopColor="#FAF" />
        <Stop offset={1} stopColor="#C9C9CF" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={17.205}
        x2={10.116}
        y1={4.865}
        y2={26.663}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.5} stopColor="#FAF" />
        <Stop offset={1} stopColor="#C9C9CF" />
      </LinearGradient>
      <RadialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-8.69689 23.5767 -52.6267 -19.8012 14.916 .724)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.6} stopColor="#FAF" />
        <Stop offset={1} stopColor="#E4E4E7" />
      </RadialGradient>
    </Defs>
  </Svg>
)

export const WishlistLine = (props: SvgProps) => (
  <Svg
    width={27}
    height={24}
    viewBox="0 0 27 24"
    fill="none"
    {...props}
  >
    <Path
      stroke="#93939F"
      strokeLinecap="round"
      strokeMiterlimit={16}
      strokeWidth={1.5}
      d="M15.669 2.538c2.63-2.724 7.104-2.272 9.14.925 2.525 3.966 1.656 9.206-2.01 12.139L13.5 23.039l-9.299-7.437C.535 12.669-.334 7.429 2.191 3.462c2.036-3.196 6.51-3.648 9.14-.924l1.535 1.592a.881.881 0 0 0 1.268 0l1.535-1.592Z"
    />
  </Svg>
)

export const WishlistFill = (props: SvgProps) => (
  <Svg
    width={27}
    height={24}
    viewBox="0 0 27 24"
    fill="none"
    {...props}
  >
    <Path
      fill="url(#wishlistFillGradient)"
      d="M23.267 16.188 13.5 24l-9.767-7.813C-.233 13.015-1.172 7.35 1.559 3.06 3.855-.546 8.904-1.056 11.87 2.018l1.536 1.591a.13.13 0 0 0 .188 0l1.536-1.591c2.966-3.074 8.015-2.564 10.31 1.042 2.732 4.29 1.793 9.955-2.173 13.128Z"
    />
    <Defs>
      <LinearGradient
        id="wishlistFillGradient"
        x1={22.781}
        x2={13.239}
        y1={-1.714}
        y2={23.903}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9888E9" />
        <Stop offset={0.498} stopColor="#FAF" />
        <Stop offset={0.921} stopColor="#E4E4E7" />
      </LinearGradient>
    </Defs>
  </Svg>
)

export const SpeedIcon = (props: SvgProps) => (
  <Svg
    width={8}
    height={12}
    viewBox="0 0 8 12"
    fill="none"
    {...props}
  >
    <Path
      fill="#332933"
      d="M.092 6.569 6.284.098c.252-.263.66.051.495.38L4.804 4.4a.537.537 0 0 0 .275.476h2.61c.276 0 .415.35.22.554L1.714 11.902c-.252.263-.66-.051-.495-.38l1.975-3.924a.537.537 0 0 0-.275-.475H.311c-.277 0-.415-.35-.22-.554Z"
    />
  </Svg>
)



