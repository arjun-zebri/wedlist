"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, Star } from "lucide-react";
import ImageGalleryModal from "./ImageGalleryModal";

interface Photo {
  id: string;
  url: string;
  alt_text: string | null;
  order_index: number;
}

interface ImageGalleryProps {
  photos: Photo[];
  mcName: string;
  featured?: boolean;
}

export default function ImageGallery({
  photos,
  mcName,
  featured = false,
}: ImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);

  if (photos.length === 0) return null;

  const openModal = (index: number) => {
    setModalStartIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Desktop Layout - 70/30 split */}
      <div className="relative hidden md:block">
        <div className="grid grid-cols-10 gap-2 overflow-hidden rounded-xl">
          {/* Large left image - 70% */}
          <button
            onClick={() => openModal(0)}
            className="relative col-span-7 h-[550px] overflow-hidden bg-gray-100 transition-opacity hover:opacity-90"
          >
            <Image
              src={photos[0].url}
              alt={`${mcName} - Photo 1`}
              fill
              className="object-cover"
              priority
            />
          </button>

          {/* Right column - 30% with 2 images stacked */}
          <div className="col-span-3 flex flex-col gap-2">
            {photos[1] && (
              <button
                onClick={() => openModal(1)}
                className="relative h-[271px] overflow-hidden bg-gray-100 transition-opacity hover:opacity-90"
              >
                <Image
                  src={photos[1].url}
                  alt={`${mcName} - Photo 2`}
                  fill
                  className="object-cover"
                />
              </button>
            )}

            {photos[2] && (
              <button
                onClick={() => openModal(2)}
                className="relative h-[271px] overflow-hidden bg-gray-100 transition-opacity hover:opacity-90"
              >
                <Image
                  src={photos[2].url}
                  alt={`${mcName} - Photo 3`}
                  fill
                  className="object-cover"
                />
              </button>
            )}
          </div>
        </div>

        {/* Featured Badge - Top Left */}
        {featured && (
          <div className="absolute left-6 top-6 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-md">
              <Star className="h-4 w-4 fill-current" />
              Featured
            </span>
          </div>
        )}

        {/* Show All Photos - Bottom Right */}
        {photos.length > 1 && (
          <button
            onClick={() => openModal(0)}
            className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg border border-gray-900 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-md transition-all hover:bg-gray-50"
          >
            <Images className="h-4 w-4" />
            Show all {photos.length} photos
          </button>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="relative md:hidden">
        <button
          onClick={() => openModal(0)}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100"
        >
          <Image
            src={photos[0].url}
            alt={`${mcName} - Photo 1`}
            fill
            className="object-cover"
            priority
          />
        </button>

        {/* Featured Badge - Mobile */}
        {featured && (
          <div className="absolute left-4 top-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-md">
              <Star className="h-4 w-4 fill-current" />
              Featured
            </span>
          </div>
        )}

        {/* Show All Photos - Mobile */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10">
            <div className="flex items-center gap-2 rounded-lg border border-gray-900 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-md">
              <Images className="h-4 w-4" />
              {photos.length} photos
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ImageGalleryModal
        photos={photos}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialIndex={modalStartIndex}
      />
    </>
  );
}
