import { Session } from 'next-auth';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = () => {
  return <div>FeedWrapper</div>;
};

export default FeedWrapper;
