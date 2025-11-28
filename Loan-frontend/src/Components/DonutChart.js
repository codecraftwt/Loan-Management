import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {G, Path, Circle, Text as SvgText} from 'react-native-svg';
import {m} from 'walstar-rn-responsive';

const toRadians = angle => (Math.PI / 180) * angle;

const createSlicePath = (cx, cy, radius, startAngle, endAngle) => {
  const start = {
    x: cx + radius * Math.cos(startAngle),
    y: cy + radius * Math.sin(startAngle),
  };
  const end = {
    x: cx + radius * Math.cos(endAngle),
    y: cy + radius * Math.sin(endAngle),
  };

  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
};

const DonutChart = ({
  data,
  radius = m(70),
  innerRadius = m(45),
  strokeWidth = 0,
  backgroundColor = '#ffffff',
  centerLabel,
  centerSubLabel,
}) => {
  const total = useMemo(
    () => data.reduce((sum, item) => sum + (item.value || 0), 0),
    [data],
  );

  const size = radius * 2;
  const center = {x: radius, y: radius};

  const slices = useMemo(() => {
    if (!total) {
      return [];
    }

    let startAngle = toRadians(-90); // start from top

    return data
      .filter(item => item.value > 0)
      .map(item => {
        const angle = (item.value / total) * Math.PI * 2;
        const endAngle = startAngle + angle;
        const path = createSlicePath(
          center.x,
          center.y,
          radius,
          startAngle,
          endAngle,
        );
        const slice = {
          path,
          color: item.color,
          label: item.label,
        };
        startAngle = endAngle;
        return slice;
      });
  }, [data, radius, total]);

  if (!total) {
    return (
      <View style={styles.emptyContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={center.x}
            cy={center.y}
            r={radius}
            fill="#f3f4f6"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth || 1}
          />
          <SvgText
            x={center.x}
            y={center.y}
            fill="#9ca3af"
            fontSize={m(10)}
            fontFamily="Poppins-Regular"
            textAnchor="middle">
            No data
          </SvgText>
        </Svg>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {slices.map((slice, index) => (
            <Path
              key={slice.label + index}
              d={slice.path}
              fill={slice.color}
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
            />
          ))}
          {/* Inner circle to create donut effect */}
          <Circle
            cx={center.x}
            cy={center.y}
            r={innerRadius}
            fill={backgroundColor}
          />

          {centerLabel ? (
            <>
              <SvgText
                x={center.x}
                y={center.y - m(2)}
                fill="#111827"
                fontSize={m(13)}
                fontFamily="Montserrat-Bold"
                textAnchor="middle">
                {centerLabel}
              </SvgText>
              {centerSubLabel ? (
                <SvgText
                  x={center.x}
                  y={center.y + m(12)}
                  fill="#6b7280"
                  fontSize={m(9)}
                  fontFamily="Poppins-Regular"
                  textAnchor="middle">
                  {centerSubLabel}
                </SvgText>
              ) : null}
            </>
          ) : null}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: m(8),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: m(8),
  },
});

export default DonutChart;


