
import './SkeletonLoader.css';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-line" style={{ width: '90%' }}></div>
      <div className="skeleton-line" style={{ width: '80%' }}></div>
      <div className="skeleton-line" style={{ width: '95%' }}></div>
      <div className="skeleton-line" style={{ width: '75%' }}></div>
      <div className="skeleton-line" style={{ width: '85%' }}></div>
    </div>
  );
};

export default SkeletonLoader;
