"use client";
import { useEffect, useState } from "react";

export default function SaleCountdown({ saleEnd }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!saleEnd) return;

    const endTime = new Date(saleEnd).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [saleEnd]);

  if (!timeLeft) return null;

  return (
    <div className="sale-timer">
      ⏰ Ends in {timeLeft.days}d {timeLeft.hours}h{" "}
      {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
}
