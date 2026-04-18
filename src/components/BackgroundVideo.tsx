import React from 'react';

const BackgroundVideo: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source 
          src="https://player.vimeo.com/external/494432654.hd.mp4?s=e7987cb324f68f184e9d0b64d39f4d7f516a2d1d&profile_id=175&oauth2_token_id=57447761" 
          type="video/mp4" 
        />
      </video>
      {/* 0.7 Opacity Black Overlay */}
      <div className="absolute inset-0 bg-[#000000]/70" />
    </div>
  );
};

export default BackgroundVideo;
