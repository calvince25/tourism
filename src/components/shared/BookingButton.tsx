"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";

interface BookingButtonProps {
  tourId?: string;
  destinationId?: string;
  itemName: string;
  className?: string;
  children: React.ReactNode;
}

export default function BookingButton({
  tourId,
  destinationId,
  itemName,
  className,
  children,
}: BookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>
      <BookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tourId={tourId}
        destinationId={destinationId}
        itemName={itemName}
      />
    </>
  );
}
