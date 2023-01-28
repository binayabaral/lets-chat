import { Skeleton, Stack } from '@chakra-ui/react';

interface SkeletonLoaderProps {
  count: number;
  height: string;
  width?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count, height, width }) => {
  return (
    <Stack spacing={2}>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          height={height}
          width={width || '100%'}
          startColor="blackAlpha.200"
          endColor="whiteAlpha.300"
        />
      ))}
    </Stack>
  );
};

export default SkeletonLoader;
