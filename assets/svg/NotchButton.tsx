import * as React from "react";
import Svg, {
	Path
} from "react-native-svg";


export const TabSVG = ({buttonHeight, radius, radius1, width, gap=0, marginHorizontal=0, numberOfButtons=3, color, borderColor}:{buttonHeight: number, radius: number, radius1?: number, width: number, gap?: number, marginHorizontal?: number, numberOfButtons?: number, color: string, borderColor: string}) => {
	const BUTTON_WIDTH = (width-2*marginHorizontal-(numberOfButtons-1)*gap)/numberOfButtons;
	const WIDTH = width, BUTTON_HEIGHT = buttonHeight, RADIUS = radius, RADIUS1 = radius1?radius1:radius;
	return (
		<Svg
			width={2*(WIDTH-RADIUS1-marginHorizontal)}
			height={BUTTON_HEIGHT+1}
			viewBox={`0 0 ${2*(WIDTH-RADIUS1-marginHorizontal)} ${BUTTON_HEIGHT+1}`}
		>
			<Path
				d={`
				M 0 0
				h ${WIDTH-BUTTON_WIDTH-RADIUS1-marginHorizontal}
				q ${RADIUS1} 0 ${RADIUS1} ${RADIUS1}
				V ${BUTTON_HEIGHT - RADIUS}
				q 0 ${RADIUS} ${RADIUS} ${RADIUS}
				h ${BUTTON_WIDTH-2*RADIUS}
				q ${RADIUS} ${0} ${RADIUS} ${-RADIUS}
				V ${RADIUS1}
				q 0 ${-RADIUS1} ${RADIUS1} ${-RADIUS1}
				h ${WIDTH-BUTTON_WIDTH-RADIUS1-marginHorizontal}
				`}
				fill={color}
			/>
			<Path
				d={`
				M 0 0.5
				h ${WIDTH-BUTTON_WIDTH-RADIUS1-marginHorizontal}
				q ${RADIUS1} 0 ${RADIUS1} ${RADIUS1}
				V ${BUTTON_HEIGHT - RADIUS}
				q 0 ${RADIUS} ${RADIUS} ${RADIUS}
				h ${BUTTON_WIDTH-2*RADIUS}
				q ${RADIUS} ${0} ${RADIUS} ${-RADIUS}
				V ${RADIUS1}
				q 0 ${-RADIUS1+0.5} ${RADIUS1} ${-RADIUS1+0.5}
				h ${WIDTH-BUTTON_WIDTH-RADIUS1-marginHorizontal}
				`}
				fill='none'
				stroke={borderColor}
				strokeWidth={1}
			/>
		</Svg>
	)
}