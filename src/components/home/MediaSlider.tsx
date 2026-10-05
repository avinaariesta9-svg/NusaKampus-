/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ExternalLink, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Radio,
  Maximize2
} from 'lucide-react';
import { MediaSlide } from '../../types';

interface MediaSliderProps {
  slides: MediaSlide[];
  onOpenSlideDetail?: (slide: MediaSlide) => void;
}

export const MediaSlider: React.FC<MediaSliderProps> = ({
  slides,
  onOpenSlideDetail,
}) => {
  // Only display active slides, sorted by order
  const activeSlides = slides
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<MediaSlide | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Touch Swipe State for Mobile
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const totalSlides = activeSlides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Gentle auto-slide every 5.5 seconds, paused on hover or when video modal is open
  useEffect(() => {
    if (isPaused || activeVideoModal || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, activeVideoModal, totalSlides, nextSlide]);

  // Handle Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // in px
    if (diff > minSwipeDistance) {
      // Swiped Left -> Next Slide
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      // Swiped Right -> Prev Slide
      prevSlide();
    }
  };

  if (totalSlides === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex];

  const handleSlideClick = (slide: MediaSlide) => {
    if (slide.type === 'video') {
      setActiveVideoModal(slide);
    } else if (onOpenSlideDetail) {
      onOpenSlideDetail(slide);
    }
  };

  return (
    <>
      <section 
        className="w-full relative select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Sorotan Media & Informasi Kampus"
      >
        {/* Section Header with Live Indicator */}
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
              <Radio className="w-3 h-3 text-indigo-600 animate-pulse" />
              <span>Sorotan Kampus</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Foto & Video Kegiatan
            </span>
          </div>

          <div className="text-[11px] font-semibold text-slate-400">
            <span className="text-indigo-600 font-bold font-mono">{currentIndex + 1}</span>
            <span> / </span>
            <span className="font-mono">{totalSlides}</span>
          </div>
        </div>

        {/* 16:9 Slider Container Card */}
        <div 
          className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-md border border-slate-200/80 group cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => handleSlideClick(currentSlide)}
        >
          {/* Media Presentation Layer */}
          {activeSlides.map((slide, index) => {
            const isSlideActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isSlideActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Image / Thumbnail with Lazy Loading */}
                <img
                  src={slide.thumbnailUrl || slide.mediaUrl}
                  alt={slide.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Modern Dark Gradient Scrim Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Badge Category on Top Left */}
                <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {slide.category}
                  </span>

                  {slide.type === 'video' && (
                    <span className="px-2 py-1 rounded-lg bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Play className="w-2.5 h-2.5 fill-white" />
                      <span>Video {slide.videoDuration ? `(${slide.videoDuration})` : ''}</span>
                    </span>
                  )}
                </div>

                {/* Video Play Pulsing Center Icon */}
                {slide.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-white/95 text-indigo-600 flex items-center justify-center shadow-xl shadow-black/40 group-hover:scale-110 group-hover:bg-white transition-all pl-1">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-indigo-600" />
                    </div>
                  </div>
                )}

                {/* Content Overlay Bottom Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20 space-y-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug drop-shadow-md line-clamp-2">
                    {slide.title}
                  </h3>
                  {slide.description && (
                    <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1 drop-shadow opacity-90 font-medium">
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Desktop Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Slide Sebelumnya"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-95 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Slide Berikutnya"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-95 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Modern Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {activeSlides.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Buka slide ke-${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive 
                    ? 'w-7 h-2 bg-indigo-600 shadow-sm shadow-indigo-600/30' 
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>
      </section>

      {/* Video Player Modal (No auto-play sound, smooth viewing) */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
            onClick={() => setActiveVideoModal(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col">
            {/* Modal Header */}
            <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold truncate">
                  {activeVideoModal.title}
                </span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Tutup Pemutar Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Area */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              <video
                src={activeVideoModal.mediaUrl}
                poster={activeVideoModal.thumbnailUrl}
                controls
                autoPlay
                muted={isVideoMuted}
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer with details */}
            <div className="p-4 bg-slate-900 text-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-medium text-slate-300">
                  {activeVideoModal.category}
                </span>
                <button
                  type="button"
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {isVideoMuted ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Aktifkan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Bungkam Suara</span>
                    </>
                  )}
                </button>
              </div>

              {activeVideoModal.description && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeVideoModal.description}
                </p>
              )}

              {activeVideoModal.linkUrl && activeVideoModal.linkUrl !== '#' && (
                <a
                  href={activeVideoModal.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-2"
                >
                  <span>Buka Informasi Selengkapnya</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
