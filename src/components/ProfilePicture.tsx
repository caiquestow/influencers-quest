// src/components/ProfilePicture.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
  influencer: {
    name: string;
    profilePicture?: string;
  };
  size?: number;
}

export default function ProfilePicture({ influencer, size = 80 }: ProfilePictureProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logs
  useEffect(() => {
    console.log('ProfilePicture Component Props:', {
      name: influencer.name,
      profilePicture: influencer.profilePicture,
      hasProfilePicture: !!influencer.profilePicture
    });
  }, [influencer]);

  if (!influencer.profilePicture || imageError) {
    return (
      <div
        className="rounded-full bg-gray-700 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-2xl text-gray-400">
          {influencer.name?.[0]?.toUpperCase() || '?'}
        </span>
      </div>
    );
  }

  const imageUrl = influencer.profilePicture.includes('instagram') || influencer.profilePicture.includes('cdninstagram')
    ? `https://images.weserv.nl/?url=${encodeURIComponent(influencer.profilePicture)}`
    : influencer.profilePicture;

  return (
    <div
      className="relative rounded-full overflow-hidden bg-gray-700"
      style={{ width: size, height: size }}
    >
      <Image
        src={imageUrl}
        alt={`${influencer.name}'s profile`}
        width={size}
        height={size}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadingComplete={() => {
          console.log('Image loaded successfully');
          setIsLoading(false);
        }}
        onError={(e) => {
          console.error('Image load error:', e);
          setImageError(true);
        }}
        unoptimized
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}