
interface AdBannerProps {
  type: 'horizontal' | 'vertical' | 'square';
}

const AdBanner = ({ type }: AdBannerProps) => {
  let className = 'w-full';
  let height = '';
  
  switch(type) {
    case 'horizontal':
      height = 'h-[90px] md:h-[90px]';
      break;
    case 'vertical':
      height = 'h-[400px]';
      className = 'w-full md:w-[300px]';
      break;
    case 'square':
      height = 'h-[250px]';
      className = 'w-full md:w-[300px]';
      break;
  }
  
  return (
    <div className={`ad-container ${className} ${height}`}>
      <div className="text-center">
        <p className="font-medium">Advertisement Space</p>
        <p className="text-xs mt-1">Google AdMob</p>
      </div>
    </div>
  );
};

export default AdBanner;
