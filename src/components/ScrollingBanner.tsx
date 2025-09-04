interface ScrollingBannerProps {
  message: string;
  bg?: string;
  textColor?: string;
}

export default function ScrollingBanner({ 
  message, 
  bg = '#AA1E1E', 
  textColor = '#FFFFFF' 
}: ScrollingBannerProps) {
  return (
    <div 
      className="w-full overflow-hidden whitespace-nowrap relative text-sm font-medium py-2"
      style={{ backgroundColor: bg, color: textColor }}
    >
      <div className="scrolling-text">
        {message} &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; {message} &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; {message} &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; {message} &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; {message} &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; {message}
      </div>
    </div>
  );
}