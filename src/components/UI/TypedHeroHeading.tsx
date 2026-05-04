'use client';

import { usePathname } from '@/i18n/navigation';
import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTypedHeroHeading } from '@/components/UI/useTypedHeroHeading';
import {
  buildTypedHeroKeys,
  resolveTypedHeroPathname,
  shouldSkipTypedHeroAnimation,
} from '@/components/UI/typedHeroHeading.helpers';

type TypedHeroHeadingProps = {
  text: string;
  className: string;
};

function splitTextIntoWords(text: string): string[] {
  return text.trim().split(/\s+/);
}

function buildLineSegments(lines: string[], displayedText: string): string[] {
  let sourceCursor = 0;

  return lines.map((line, index) => {
    const sourceLine = index < lines.length - 1 ? `${line} ` : line;
    const visibleChunk = displayedText.slice(sourceCursor, sourceCursor + sourceLine.length);
    sourceCursor += sourceLine.length;

    return index < lines.length - 1 ? visibleChunk.replace(/\s$/, '') : visibleChunk;
  });
}

function getActiveLineIndex(lines: string[], displayedText: string): number {
  let sourceCursor = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const sourceLine = index < lines.length - 1 ? `${lines[index]} ` : lines[index];
    const nextCursor = sourceCursor + sourceLine.length;

    if (displayedText.length <= nextCursor) {
      return index;
    }

    sourceCursor = nextCursor;
  }

  return Math.max(0, lines.length - 1);
}

const TypedHeroHeadingInner = ({
  text,
  className,
  shouldSkipTyping,
  visitedKey,
}: {
  text: string;
  className: string;
  shouldSkipTyping: boolean;
  visitedKey: string;
}) => {
  const { displayedText, isDesktop, isReducedMotion, isFinished } = useTypedHeroHeading({
    text,
    visitedKey,
    shouldSkipTyping,
  });
  const measurementRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = useMemo(() => splitTextIntoWords(text), [text]);
  const [lines, setLines] = useState<string[]>([text]);
  const shouldShowCursor = isDesktop && !isReducedMotion && !isFinished;
  const lineSegments = useMemo(
    () => buildLineSegments(lines, displayedText),
    [displayedText, lines],
  );
  const activeLineIndex = shouldShowCursor ? getActiveLineIndex(lines, displayedText) : -1;

  useLayoutEffect(() => {
    if (!measurementRef.current || words.length === 0) {
      return;
    }

    const measureLines = () => {
      const nextLines: string[] = [];
      let currentLineWords: string[] = [];
      let currentOffsetTop: number | null = null;

      for (const wordNode of wordRefs.current) {
        if (!wordNode) {
          continue;
        }

        if (currentOffsetTop === null) {
          currentOffsetTop = wordNode.offsetTop;
        }

        if (wordNode.offsetTop !== currentOffsetTop) {
          nextLines.push(currentLineWords.join(' '));
          currentLineWords = [wordNode.dataset.word ?? ''];
          currentOffsetTop = wordNode.offsetTop;
          continue;
        }

        currentLineWords.push(wordNode.dataset.word ?? '');
      }

      if (currentLineWords.length > 0) {
        nextLines.push(currentLineWords.join(' '));
      }

      setLines(nextLines.length > 0 ? nextLines : [text]);
    };

    measureLines();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      measureLines();
    });

    resizeObserver.observe(measurementRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [text, words]);

  return (
    <div className="relative">
      <h1 className={`${className} md:hidden`}>{text}</h1>

      <div
        ref={measurementRef}
        aria-hidden="true"
        className={`${className} hidden text-transparent select-none md:block`}
      >
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span
              ref={(node) => {
                wordRefs.current[index] = node;
              }}
              data-word={word}
            >
              {word}
            </span>
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </div>

      <h1
        className={`${className} hidden text-white md:block md:absolute md:inset-0`}
        aria-label={text}
      >
        {lineSegments.map((lineText, index) => (
          <span key={`${lines[index]}-${index}`} className={lines.length > 1 ? 'block' : 'inline'}>
            <span className="relative inline">
              {lineText}
              {shouldShowCursor && activeLineIndex === index ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[calc(100%+0.04em)] top-[0.08em] h-[0.9em] w-0.5 bg-white"
                  style={{
                    animation: 'hero-heading-cursor-blink 1s steps(1, end) infinite',
                    opacity: 1,
                  }}
                />
              ) : null}
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
};

const TypedHeroHeading = ({ text, className }: TypedHeroHeadingProps) => {
  const pathname = usePathname();
  const rawPathname = pathname || '/';
  const resolvedPathname = resolveTypedHeroPathname(rawPathname);
  const { headingKey, visitedKey } = buildTypedHeroKeys(resolvedPathname, text);
  const shouldSkipTyping = shouldSkipTypedHeroAnimation(resolvedPathname);

  return (
    <TypedHeroHeadingInner
      key={headingKey}
      text={text}
      className={className}
      shouldSkipTyping={shouldSkipTyping}
      visitedKey={visitedKey}
    />
  );
};

export default TypedHeroHeading;
