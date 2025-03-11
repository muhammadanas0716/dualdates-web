"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
// Import moment-hijri for Islamic calendar support
import momentHijri from "moment-hijri";
import "moment/locale/ar-sa"; // Import Arabic locale for proper formatting
// Import adhan for prayer times calculation - only need Coordinates type
import { Coordinates } from "adhan";
// Import our custom prayer helper
import { calculatePrayerTimes } from "@/lib/prayerHelper";

export default function Hero() {
  const [unlocked, setUnlocked] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [hijriInfo, setHijriInfo] = useState("");
  // For prayer countdown (used in updateDateTime function)
  const [prayerInfo, setPrayerInfo] = useState({ name: "", timeRemaining: "" });
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  // Store location errors to display to user if needed
  const [locationError, setLocationError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  // Sound objects
  const [sounds, setSounds] = useState<{
    unlockSound: HTMLAudioElement | null;
    clickSound: HTMLAudioElement | null;
  }>({
    unlockSound: null,
    clickSound: null,
  });

  // Initialize sound effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create new Audio objects
      const unlockSound = new Audio("/sounds/unlock.mp3");
      const clickSound = new Audio("/sounds/click.mp3");

      // Set volumes
      unlockSound.volume = 0.5;
      clickSound.volume = 0.2;

      // Set in state
      setSounds({
        unlockSound,
        clickSound,
      });
    }
  }, []);

  // Function to play sound
  const playSound = (sound: HTMLAudioElement | null) => {
    if (!muted && sound) {
      // Reset sound to beginning if it's already playing
      sound.pause();
      sound.currentTime = 0;

      // Play the sound
      sound.play().catch((error) => {
        // Handle play() promise rejection (autoplay policy)
        console.log("Audio playback error:", error);
      });
    }
  };

  // Handle the unlock animation
  const handleUnlock = () => {
    playSound(sounds.unlockSound);
    setTransitioning(true);
    setTimeout(() => {
      setUnlocked(true);
      setTimeout(() => {
        setTransitioning(false);
      }, 300);
    }, 500);
  };

  // Handle button click sound
  const handleButtonClick = () => {
    playSound(sounds.clickSound);
  };

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setLocationError(
            "Could not get your location. Using default prayer times."
          );
        }
      );
    } else {
      setLocationError(
        "Geolocation is not supported by this browser. Using default prayer times."
      );
    }
  }, []);

  // Update time and date every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format time as HH:MM
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      // Format date as Day of week, DD Month
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const dayOfWeek = dayNames[now.getDay()];
      const day = String(now.getDate()).padStart(2, "0");
      const month = monthNames[now.getMonth()];
      setCurrentDate(`${dayOfWeek}, ${day} ${month}`);

      // Calculate Hijri date using moment-hijri
      const hijriDate = momentHijri();
      const hijriDay = hijriDate.iDate();
      const hijriMonth = hijriDate.iMonth();
      const hijriYear = hijriDate.iYear();

      // Get Hijri month name (abbreviated)
      const hijriMonthNames = [
        "Mhrm",
        "Safar",
        "Rabi I",
        "Rabi II",
        "Jmda I",
        "Jmda II",
        "Rajab",
        "Shbn",
        "Rmdn",
        "Shwl",
        "Dhul-Q",
        "Dhul-H",
      ];
      const hijriMonthName = hijriMonthNames[hijriMonth];

      // Get prayer times based on location using our helper
      const { nextPrayerName, timeRemaining } = calculatePrayerTimes(
        userLocation,
        now
      );

      // Format Hijri date and combine with next prayer time
      setHijriInfo(
        `${hijriMonthName}. ${hijriDay}, ${hijriYear} | ${nextPrayerName} in ${timeRemaining}`
      );
    };

    // Update immediately and then every second
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [userLocation]); // Re-run effect when location changes

  return (
    <section className="w-full flex flex-col items-center py-12 md:py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Sound effect toggle button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => {
              setMuted(!muted);
              playSound(sounds.clickSound);
            }}
            className="p-2 rounded-full bg-stone-200/30 dark:bg-stone-800/30 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors duration-200"
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          >
            {muted ? (
              <svg
                className="w-5 h-5 text-stone-600 dark:text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.586 15.414a8 8 0 110-6.828m12.207-3.586a12 12 0 010 14"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.536 8.464a5 5 0 010 7.072M12 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m0-8v-.5A1.5 1.5 0 015.5 2h2A1.5 1.5 0 019 3.5V6H6a2 2 0 00-2 2z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-stone-600 dark:text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M21.192 2.808a13 13 0 010 18.384"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h4a2 2 0 012 2z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-16">
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-8 animate-fade-in leading-tight"
            style={{ lineHeight: 1 }}
          >
            Hijri Dates & Prayer Times
            <br />
            <span className="relative inline-flex items-center">
              For your
              <span className="relative inline-flex items-center px-3 py-1">
                <svg
                  className="h-14 w-14 inline-block mr-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19.37 7.648c-.114.088-2.11 1.213-2.11 3.715 0 2.894 2.54 3.918 2.616 3.944-.011.062-.403 1.402-1.34 2.767-.834 1.201-1.706 2.4-3.032 2.4s-1.667-.77-3.198-.77c-1.492 0-2.022.796-3.235.796-1.214 0-2.06-1.112-3.033-2.477C4.911 16.42 4 13.93 4 11.566c0-3.791 2.465-5.802 4.891-5.802 1.29 0 2.364.847 3.173.847.77 0 1.972-.897 3.438-.897.556 0 2.553.05 3.867 1.934Zm-4.564-3.54c.607-.719 1.036-1.718 1.036-2.716 0-.138-.012-.279-.037-.392-.987.037-2.161.657-2.87 1.478-.555.632-1.074 1.63-1.074 2.643 0 .152.026.304.037.353.063.011.164.025.266.025.885 0 1.998-.593 2.642-1.39Z"></path>
                </svg>
                Mac
                <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-rose-300/80 rounded-md -z-10 -mx-1"></div>
              </span>
            </span>
          </h1>
          <p className="text-xl max-w-2xl text-foreground/80 mb-12 animate-fade-in animate-delay-100">
            A beautiful menu bar app that shows Islamic dates and prayer times,
            with countdown to the next prayer and inspirational Islamic quotes.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 animate-fade-in animate-delay-200">
            <Link
              href="/download"
              className="group relative inline-flex max-h-[3.75rem] items-center justify-center rounded-2xl px-5 py-4 text-lg font-bold outline-none transition duration-300 focus:ring-2 focus:ring-rose-300/90 bg-stone-800 text-[#f5e5d5] shadow-xl shadow-stone-800/20 after:absolute after:inset-0 after:hidden after:rounded-2xl after:shadow-2xl after:shadow-orange-950/25 after:content-[''] sm:shadow-orange-950/25 sm:after:block pl-[3.25rem] mb-16"
              aria-label="Download for Mac"
              onClick={handleButtonClick}
            >
              <div className="ease absolute left-5 translate-x-0 opacity-100 transition duration-300 group-hover:-translate-x-full group-hover:scale-x-50 group-hover:opacity-0 group-hover:blur-sm">
                <svg
                  className="h-6 w-6 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.37 7.648c-.114.088-2.11 1.213-2.11 3.715 0 2.894 2.54 3.918 2.616 3.944-.011.062-.403 1.402-1.34 2.767-.834 1.201-1.706 2.4-3.032 2.4s-1.667-.77-3.198-.77c-1.492 0-2.022.796-3.235.796-1.214 0-2.06-1.112-3.033-2.477C4.911 16.42 4 13.93 4 11.566c0-3.791 2.465-5.802 4.891-5.802 1.29 0 2.364.847 3.173.847.77 0 1.972-.897 3.438-.897.556 0 2.553.05 3.867 1.934Zm-4.564-3.54c.607-.719 1.036-1.718 1.036-2.716 0-.138-.012-.279-.037-.392-.987.037-2.161.657-2.87 1.478-.555.632-1.074 1.63-1.074 2.643 0 .152.026.304.037.353.063.011.164.025.266.025.885 0 1.998-.593 2.642-1.39Z"></path>
                </svg>
              </div>
              <div className="ease translate-x-0 transition duration-300 group-hover:-translate-x-8 text-[#f5e5d5]">
                Download <span>for Mac</span>
              </div>
              <div className="ease absolute right-5 translate-x-full scale-x-50 opacity-0 blur-sm transition duration-300 group-hover:translate-x-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:blur-none">
                <svg
                  className="h-6 w-6 fill-transparent stroke-current stroke-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                </svg>
              </div>
            </Link>

            <Link
              href="/donate"
              className="group relative inline-flex max-h-[3.75rem] items-center justify-center rounded-2xl px-5 py-4 text-lg font-bold outline-none transition duration-300 focus:ring-2 focus:ring-rose-300/90 bg-orange-950/5 pl-6 border border-stone-800/10 hover:border-stone-800/20"
              aria-label="Donate"
              onClick={handleButtonClick}
            >
              <svg
                className="mr-2.5 h-[22px] w-[22px] fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 28 28"
                aria-hidden="true"
              >
                <g
                  className="origin-center fill-current"
                  style={{ transform: "rotate(45deg)" }}
                >
                  <path
                    className="group-hover:running pause ease origin-center animate-rotate text-orange-950/25 transition duration-300 group-hover:text-rose-400/75"
                    d="M7.21 24.471h2.542c.235 0 .41.07.586.246l1.805 1.793c1.477 1.488 2.848 1.477 4.324 0l1.805-1.793c.188-.175.352-.246.598-.246h2.53c2.099 0 3.071-.96 3.071-3.07V18.87c0-.247.07-.41.246-.598l1.793-1.805c1.488-1.476 1.477-2.847 0-4.324l-1.793-1.805a.763.763 0 0 1-.246-.586V7.21c0-2.085-.96-3.07-3.07-3.07H18.87a.777.777 0 0 1-.598-.234l-1.805-1.793c-1.476-1.488-2.847-1.477-4.324 0l-1.805 1.793a.752.752 0 0 1-.586.234H7.21c-2.097 0-3.07.961-3.07 3.07v2.543c0 .235-.058.41-.234.586l-1.793 1.805c-1.488 1.477-1.477 2.848 0 4.324l1.793 1.805a.777.777 0 0 1 .234.598v2.53c0 2.099.973 3.071 3.07 3.071Z"
                  ></path>
                </g>
                <path
                  className="text-foreground"
                  d="M12.998 20.03c-.398 0-.726-.153-1.03-.563l-2.942-3.61c-.176-.233-.281-.503-.281-.76 0-.54.41-.973.949-.973.328 0 .586.117.879.503l2.379 3.07 5.004-8.038c.222-.364.527-.54.843-.54.504 0 .985.352.985.891 0 .27-.153.54-.293.774l-5.508 8.683c-.246.375-.586.563-.985.563Z"
                ></path>
              </svg>
              <span className="text-foreground">Donate</span>
            </Link>
          </div>
        </div>

        {/* Mac Screen Display */}
        <div className="relative w-full max-w-7xl mx-auto aspect-[18/10] rounded-3xl overflow-hidden shadow-2xl animate-fade-in animate-delay-300 border border-stone-800/20 hover:shadow-accent/10 hover:shadow-2xl transition-all duration-500">
          {/* Background that stays for both states */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-stone-800 z-0">
            <Image
              src="https://cdn.tryalcove.com/images/wallpaper.webp"
              alt="Wallpaper"
              fill
              className="object-cover object-center opacity-80"
              priority
            />
          </div>

          {/* Lock screen content with fade animation */}
          <div
            className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-500 ${
              unlocked ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="mb-4 text-3xl font-semibold text-white/85">
              <span>{currentDate}</span>
            </div>
            <div className="text-8xl font-bold text-white/90 mb-8">
              {currentTime}
            </div>

            <div className="flex flex-col items-center mt-8">
              <div className="flex justify-center mb-4">
                <div className="relative flex h-10 w-[210px] overflow-hidden rounded-xl bg-black text-white">
                  <div className="absolute left-0 top-0 flex h-10 items-center">
                    <div className="pl-2.5">
                      <svg
                        className="h-[18px] w-[18px] fill-current"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M4.21913,6.85699 L5.46719,6.85699 L5.46719,4.60904 C5.46719,3.04945 6.46827,2.19354 7.66062,2.19354 C8.85055,2.19354 9.86619,3.04945 9.86619,4.60904 L9.86619,6.85699 L11.10875,6.85699 L11.10875,4.73287 C11.10875,2.27366 9.48122,1 7.66062,1 C5.8455,1 4.21913,2.27366 4.21913,4.73287 L4.21913,6.85699 Z"></path>
                        <path d="M4.54279,14.2793 L10.78394,14.2793 C11.79607,14.2793 12.3267,13.7365 12.3267,12.6438 L12.3267,7.92337 C12.3267,6.83432 11.79607,6.29701 10.78394,6.29701 L4.54279,6.29701 C3.529458,6.29701 3,6.83432 3,7.92337 L3,12.6438 C3,13.7365 3.529458,14.2793 4.54279,14.2793 Z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className={`cursor-pointer p-4 px-8 text-2xl font-bold text-white/90 sm:text-xl sm:font-semibold bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  transitioning ? "opacity-0" : "opacity-100"
                }`}
                onClick={handleUnlock}
                disabled={transitioning}
              >
                Press to unlock
              </button>
            </div>
          </div>

          {/* Home screen content with fade animation */}
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-500 ${
              unlocked && !transitioning
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Menu Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-3">
              {/* Apple Logo */}
              <div className="flex h-8 w-8 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-all duration-300 ease-in-out">
                {/* Default SVG (visible when not hovered) */}
                <svg
                  className="h-5 w-5 fill-white group-hover:opacity-0 transition-opacity duration-300 ease-in-out absolute"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.37 7.648c-.114.088-2.11 1.213-2.11 3.715 0 2.894 2.54 3.918 2.616 3.944-.011.062-.403 1.402-1.34 2.767-.834 1.201-1.706 2.4-3.032 2.4s-1.667-.77-3.198-.77c-1.492 0-2.022.796-3.235.796-1.214 0-2.06-1.112-3.033-2.477C4.911 16.42 4 13.93 4 11.566c0-3.791 2.465-5.802 4.891-5.802 1.29 0 2.364.847 3.173.847.77 0 1.972-.897 3.438-.897.556 0 2.553.05 3.867 1.934Zm-4.564-3.54c.607-.719 1.036-1.718 1.036-2.716 0-.138-.012-.279-.037-.392-.987.037-2.161.657-2.87 1.478-.555.632-1.074 1.63-1.074 2.643 0 .152.026.304.037.353.063.011.164.025.266.025.885 0 1.998-.593 2.642-1.39Z"></path>
                </svg>

                {/* Hover SVG (visible only on hover) */}
                <svg
                  className="size-full fill-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.37 7.648c-.114.088-2.11 1.213-2.11 3.715 0 2.894 2.54 3.918 2.616 3.944-.011.062-.403 1.402-1.34 2.767-.834 1.201-1.706 2.4-3.032 2.4s-1.667-.77-3.198-.77c-1.492 0-2.022.796-3.235.796-1.214 0-2.06-1.112-3.033-2.477C4.911 16.42 4 13.93 4 11.566c0-3.791 2.465-5.802 4.891-5.802 1.29 0 2.364.847 3.173.847.77 0 1.972-.897 3.438-.897.556 0 2.553.05 3.867 1.934Zm-4.564-3.54c.607-.719 1.036-1.718 1.036-2.716 0-.138-.012-.279-.037-.392-.987.037-2.161.657-2.87 1.478-.555.632-1.074 1.63-1.074 2.643 0 .152.026.304.037.353.063.011.164.025.266.025.885 0 1.998-.593 2.642-1.39Z"></path>
                </svg>
              </div>

              {/* Music Player in the Center of Menu Bar */}
              <div className="absolute left-1/2 top-3 transform -translate-x-1/2 z-30">
                <div
                  className="relative flex h-10 origin-top overflow-hidden rounded-xl text-white transition-all duration-300 hover:shadow-lg hover:scale-110"
                  style={{ width: "210px" }}
                >
                  <div
                    className="h-full w-full rounded-xl bg-black"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="absolute left-0 top-0 flex h-10 items-center">
                      <div className="origin-[20%_0%] pl-[9px]">
                        <div className="ease transition duration-500">
                          <div className="ease transition duration-500">
                            <div className="ease transition duration-500 scale-[0.85]">
                              <div
                                className="size-[22px] rounded-md !bg-cover transition-all duration-150"
                                style={{
                                  background: `url("https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2f/89/3a/2f893a51-765f-a22a-1e2c-23594c37a099/5021732386014.jpg/64x64bb.jpg")`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute right-0 top-0 flex h-10 items-center">
                      <div className="group pr-[9px]">
                        <div className="flex w-5 items-center justify-center space-x-[1.5px] brightness-110">
                          <div
                            className="ease size-0.5 max-h-5 animate-[playing_0.95s_ease_infinite] rounded-[1px] transition-all duration-500 pause !max-h-0.5"
                            style={{
                              backgroundImage:
                                "linear-gradient(rgb(90, 126, 209), rgb(67, 68, 73))",
                            }}
                          ></div>
                          <div
                            className="ease size-0.5 max-h-5 animate-[playing_1.46s_ease_infinite] rounded-[1px] transition-all duration-500 pause !max-h-0.5"
                            style={{
                              backgroundImage:
                                "linear-gradient(rgb(90, 126, 209), rgb(67, 68, 73))",
                            }}
                          ></div>
                          <div
                            className="ease size-0.5 max-h-5 animate-[playing_0.82s_ease_infinite] rounded-[1px] transition-all duration-500 pause !max-h-0.5"
                            style={{
                              backgroundImage:
                                "linear-gradient(rgb(90, 126, 209), rgb(67, 68, 73))",
                            }}
                          ></div>
                          <div
                            className="ease size-0.5 max-h-5 animate-[playing_1.24s_ease_infinite] rounded-[1px] transition-all duration-500 pause !max-h-0.5"
                            style={{
                              backgroundImage:
                                "linear-gradient(rgb(90, 126, 209), rgb(67, 68, 73))",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex origin-top justify-center pb-[11px] text-xs font-semibold text-stone-300/85 opacity-0">
                      <div className="relative flex">
                        <div className="inline-flex shrink-0 items-center whitespace-nowrap px-1.5">
                          <svg
                            className="mr-0.5 size-[15px] fill-current text-stone-600"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 28 28"
                            aria-hidden="true"
                          >
                            <path d="M20.797 7.166V2.914c0-.6-.486-.984-1.063-.871L13.92 3.309c-.724.159-1.12.555-1.12 1.188l.023 12.576c.057.554-.203.915-.701 1.017l-1.798.373C8.063 18.939 7 20.093 7 21.8c0 1.73 1.334 2.94 3.212 2.94 1.662 0 4.15-1.221 4.15-4.512V9.88c0-.6.113-.724.645-.837l5.168-1.13c.384-.08.622-.374.622-.747Z"></path>
                          </svg>
                          <span>places to be</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Menu */}
              <div className="flex h-10 items-center justify-center space-x-4 rounded-[10px] rounded-tr-2xl bg-orange-50/10 px-6 text-orange-50 backdrop-blur-xl">
                <div className="text-[14px] font-medium whitespace-nowrap min-w-[180px]">
                  {hijriInfo}
                </div>

                <time className="whitespace-nowrap text-[15px] font-medium">
                  <span>{currentTime}</span>
                </time>
              </div>
            </div>

            {/* Dock at the Bottom */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
              <div className="relative flex items-center justify-center rounded-3xl bg-orange-50/15 pb-2 pl-2 pr-2 pt-[8px] before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:border-t before:border-orange-50/15 before:backdrop-blur-xl">
                {/* Create a container for dock items */}
                <div className="flex items-end" id="dock-container">
                  {/* App 1 */}
                  <div className="px-1">
                    <div className="flex items-center justify-center">
                      <div className="size-12 relative">
                        <Image
                          className="object-cover cursor-pointer"
                          src="https://cdn.tryalcove.com/images/app-icon.png"
                          alt="App Icon"
                          width={48}
                          height={48}
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* App 2 */}
                  <div className="px-1">
                    <div className="flex items-center justify-center">
                      <div className="size-12 relative">
                        <Image
                          className="object-cover cursor-pointer"
                          src="https://cdn.tryalcove.com/images/klack-app-icon.png"
                          alt="Klack App Icon"
                          width={48}
                          height={48}
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* App 3 */}
                  <div className="px-1">
                    <div className="size-12 rounded-[8px] bg-orange-50 bg-opacity-15 relative"></div>
                  </div>

                  {/* App 4 */}
                  <div className="px-1">
                    <div className="size-12 rounded-[8px] bg-orange-50 bg-opacity-15 relative"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in animate-delay-400 scale-105">
          {[
            { icon: "⏱️", title: "Prayer Times" },
            { icon: "🗓️", title: "Islamic Calendar" },
            { icon: "📝", title: "Islamic Quotes" },
            { icon: "🔔", title: "Prayer Notifications" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300 animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-3xl mb-3 transform transition-transform group-hover:scale-110 duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-medium">{item.title}</h3>
            </div>
          ))}
        </div>

        {/* Download and Social Media Section */}
        <div className="flex flex-col items-center justify-center mt-24 mb-16 animate-fade-in animate-delay-500">
          {/* Download Button */}
          <Link
            href="/download"
            className="group relative inline-flex max-h-[3.75rem] items-center justify-center rounded-2xl px-5 py-4 text-lg font-bold outline-none transition duration-300 focus:ring-2 focus:ring-rose-300/90 bg-stone-800 text-[#f5e5d5] shadow-xl shadow-stone-800/20 after:absolute after:inset-0 after:hidden after:rounded-2xl after:shadow-2xl after:shadow-orange-950/25 after:content-[''] sm:shadow-orange-950/25 sm:after:block pl-[3.25rem] mb-16"
            aria-label="Download for Mac"
            onClick={handleButtonClick}
          >
            <div className="ease absolute left-5 translate-x-0 opacity-100 transition duration-300 group-hover:-translate-x-full group-hover:scale-x-50 group-hover:opacity-0 group-hover:blur-sm">
              <svg
                className="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19.37 7.648c-.114.088-2.11 1.213-2.11 3.715 0 2.894 2.54 3.918 2.616 3.944-.011.062-.403 1.402-1.34 2.767-.834 1.201-1.706 2.4-3.032 2.4s-1.667-.77-3.198-.77c-1.492 0-2.022.796-3.235.796-1.214 0-2.06-1.112-3.033-2.477C4.911 16.42 4 13.93 4 11.566c0-3.791 2.465-5.802 4.891-5.802 1.29 0 2.364.847 3.173.847.77 0 1.972-.897 3.438-.897.556 0 2.553.05 3.867 1.934Zm-4.564-3.54c.607-.719 1.036-1.718 1.036-2.716 0-.138-.012-.279-.037-.392-.987.037-2.161.657-2.87 1.478-.555.632-1.074 1.63-1.074 2.643 0 .152.026.304.037.353.063.011.164.025.266.025.885 0 1.998-.593 2.642-1.39Z"></path>
              </svg>
            </div>
            <div className="ease translate-x-0 transition duration-300 group-hover:-translate-x-8 text-[#f5e5d5]">
              Download <span>for Mac</span>
            </div>
            <div className="ease absolute right-5 translate-x-full scale-x-50 opacity-0 blur-sm transition duration-300 group-hover:translate-x-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:blur-none">
              <svg
                className="h-6 w-6 fill-transparent stroke-current stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
              </svg>
            </div>
          </Link>
        </div>

        {/* Add the new footer */}
        <footer className="relative flex flex-col items-center justify-center px-8 pb-20 mt-20 delay-[1300ms] sm:pb-0 dark:delay-[800ms]">
          <div className="flex items-center justify-center space-x-3 mt-6">
            <a
              className="group inline-flex items-center outline-none transition duration-300 hover:bg-orange-950/5 focus:ring-2 focus:ring-rose-300/90 dark:bg-orange-75/5 dark:hover:bg-orange-75/5 rounded-xl bg-orange-950/5 p-2 text-orange-950/50 hover:text-orange-950/75 dark:text-orange-75 dark:hover:text-orange-75"
              href="https://twitter.com/dualdate"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="X (Twitter)"
            >
              <svg
                className="size-5 fill-current transition duration-300 ease-out group-hover:scale-105 dark:opacity-50 dark:group-hover:opacity-100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>

            <a
              className="group inline-flex items-center outline-none transition duration-300 hover:bg-orange-950/5 focus:ring-2 focus:ring-rose-300/90 dark:bg-orange-75/5 dark:hover:bg-orange-75/5 rounded-xl bg-orange-950/5 p-2 text-orange-950/50 hover:text-orange-950/75 dark:text-orange-75 dark:hover:text-orange-75"
              href="https://github.com/dualdate/app"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="GitHub"
            >
              <svg
                className="size-5 fill-current transition duration-300 ease-out group-hover:scale-105 dark:opacity-50 dark:group-hover:opacity-100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <a
              className="group inline-flex items-center outline-none transition duration-300 hover:bg-orange-950/5 focus:ring-2 focus:ring-rose-300/90 dark:bg-orange-75/5 dark:hover:bg-orange-75/5 rounded-xl bg-orange-950/5 p-2 text-orange-950/50 hover:text-orange-950/75 dark:text-orange-75 dark:hover:text-orange-75"
              href="https://discord.gg/dualdate"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Discord"
            >
              <svg
                className="size-5 fill-current transition duration-300 ease-out group-hover:scale-105 dark:opacity-50 dark:group-hover:opacity-100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 127.14 96.36"
                aria-hidden="true"
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
            </a>
          </div>

          <div className="pointer-events-none mt-8 hidden select-none overflow-hidden bg-gradient-to-b from-orange-950/10 from-25% to-orange-950/0 bg-clip-text text-[9rem] font-black leading-none text-transparent sm:block sm:h-28 md:h-36 md:text-[12rem] lg:h-44 lg:text-[14rem] dark:from-orange-75/10 dark:to-orange-75/0">
            DualDates
          </div>
        </footer>
      </div>
    </section>
  );
}
