import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {View} from 'react-native';

const LoaderSkeleton = () => {
  return (
    <>
      <ContentLoader speed={1} viewBox="0 0 400 320" height={280} width={400}>
        {/* First Skeleton Row */}

        <Circle cx="40" cy="40" r="30" />
        <Rect x="80" y="15" rx="4" ry="4" width="70%" height="20" />
        <Rect x="80" y="45" rx="4" ry="4" width="60%" height="20" />
        <Rect x="80" y="75" rx="4" ry="4" width="50%" height="20" />
        <Rect x="80" y="105" rx="4" ry="4" width="40%" height="20" />

        <View style={{marginTop: 50}}></View>

        <Circle cx="40" cy="180" r="30" />
        <Rect x="80" y="115" rx="4" ry="4" width="70%" height="20" />
        <Rect x="80" y="145" rx="4" ry="4" width="60%" height="20" />
        <Rect x="80" y="175" rx="4" ry="4" width="50%" height="20" />
        <Rect x="80" y="205" rx="4" ry="4" width="40%" height="20" />
      </ContentLoader>
    </>
  );
};

export default LoaderSkeleton;
