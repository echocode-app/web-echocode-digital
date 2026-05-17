'use client';

import { useCallback, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

type InfoTooltipProps = {
  text: string;
  label: string;
  icon?: string;
  buttonClassName?: string;
};

const TOOLTIP_GUTTER = 16;
const TOOLTIP_MAX_WIDTH = 260;

export default function InfoTooltip({
  text,
  label,
  icon = 'ⓘ',
  buttonClassName = '',
}: InfoTooltipProps) {
  const tooltipId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({
    left: TOOLTIP_GUTTER,
    top: TOOLTIP_GUTTER,
    width: TOOLTIP_MAX_WIDTH,
  });

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;

    if (!button) return;

    const rect = button.getBoundingClientRect();
    const tooltipWidth = Math.min(TOOLTIP_MAX_WIDTH, window.innerWidth - TOOLTIP_GUTTER * 2);
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? 96;
    const preferredLeft = rect.right - tooltipWidth;
    const left = Math.min(
      Math.max(preferredLeft, TOOLTIP_GUTTER),
      window.innerWidth - tooltipWidth - TOOLTIP_GUTTER,
    );
    const preferredTop = rect.bottom + 8;
    const top =
      preferredTop + tooltipHeight + TOOLTIP_GUTTER > window.innerHeight
        ? Math.max(TOOLTIP_GUTTER, rect.top - tooltipHeight - 8)
        : preferredTop;

    setStyle({
      left,
      top,
      width: tooltipWidth,
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  return (
    <div
      className="shrink-0"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-describedby={isOpen ? tooltipId : undefined}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className={`inline-flex h-5 w-5 items-center justify-center 
          rounded-full border border-transparent 
          bg-black/30 font-main text-main-xs 
          leading-none text-gray75 
          transition duration-main hover:text-accent-hover 
          focus-visible:text-accent-hover focus-visible:outline-none focus-visible:ring-1 
          focus-visible:ring-accent-hover ${buttonClassName}`}
      >
        {icon}
      </button>
      {isOpen && typeof document !== 'undefined'
        ? createPortal(
            // Portal keeps admin tooltips above clipped dashboard panels.
            <div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              style={style}
              className="
                pointer-events-none fixed z-[400]
                origin-top-right rounded-(--radius-secondary)
                border border-gray16 bg-base-gray
                p-3 font-main text-main-xs text-gray75
                opacity-100 shadow-button
              "
            >
              {text}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
