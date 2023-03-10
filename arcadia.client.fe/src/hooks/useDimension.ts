import {
  RefObject, useState, useRef, useEffect, useCallback,
} from 'react';
import { ResizeObserver, ResizeObserverEntry } from '@juggle/resize-observer';

// TODO: Replace it by relative npm dependency after ref change detection will be fixed in the library
// Original hook can be found here - https://github.com/wellyshen/react-cool-dimensions

// eslint-disable-next-line max-len
export const observerErr = "The browser doesn't support Resize Observer, please use polyfill: https://github.com/wellyshen/react-cool-dimensions#resizeobserver-polyfill";
// eslint-disable-next-line max-len
export const borderBoxWarn = "The browser doesn't support border-box size, fallback to content-box size. Please see: https://github.com/wellyshen/react-cool-dimensions#border-box-size-measurement";

interface State {
  currentBreakpoint: string;
  width: number;
  height: number;
  entry?: ResizeObserverEntry;
}

interface Event extends State {
  entry: ResizeObserverEntry;
  observe: () => void;
  unobserve: () => void;
}

interface OnResize {
  (event: Event): void;
}

type Breakpoints = { [key: string]: number };

export interface Options<T> {
  ref?: RefObject<T>;
  useBorderBoxSize?: boolean;
  breakpoints?: Breakpoints;
  onResize?: OnResize;
  polyfill?: any;
}

interface Return<T> extends Omit<Event, 'entry'> {
  ref: RefObject<T>;
  entry?: ResizeObserverEntry;
}

const getCurrentBreakpoint = (bps: Breakpoints, w: number): string => {
  let curBp = '';
  let max = -1;

  Object.keys(bps).forEach((key: string) => {
    const val = bps[key];

    if (w >= val && val > max) {
      curBp = key;
      max = val;
    }
  });

  return curBp;
};

export const useDimensions = <T extends HTMLElement>({
  ref: refOpt,
  useBorderBoxSize = false,
  breakpoints,
  onResize,
  polyfill,
}: Options<T> = {}): Return<T> => {
  const [state, setState] = useState<State>({
    currentBreakpoint: '',
    width: 0,
    height: 0,
  });
  const prevSizeRef = useRef<{ width?: number; height?: number }>({});
  const prevBreakpointRef = useRef<string>();
  const isObservingRef = useRef<boolean>(false);
  const observerRef = useRef<ResizeObserver | null>(null);
  const onResizeRef = useRef<OnResize | null>(null);
  const warnedRef = useRef<boolean>(false);
  const refVar = useRef<T>(null);
  const ref = refOpt || refVar;

  useEffect(() => {
    if (onResize) onResizeRef.current = onResize;
  }, [onResize]);

  const observe = useCallback(() => {
    if (isObservingRef.current || !observerRef.current) return;

    observerRef.current.observe(ref.current as Element);
    isObservingRef.current = true;
  }, [ref]);

  const unobserve = useCallback(() => {
    if (!isObservingRef.current || !observerRef.current) return;

    observerRef.current.disconnect();
    isObservingRef.current = false;
  }, []);

  useEffect(() => {
    if (!ref.current) return () => null;

    if (
      (!('ResizeObserver' in window) || !('ResizeObserverEntry' in window))
      && !polyfill
    ) {
      // eslint-disable-next-line no-console
      console.error(observerErr);

      return () => null;
    }

    // @ts-ignore
    observerRef.current = new (window.ResizeObserver || polyfill)(([entry]) => {
      const { contentBoxSize, borderBoxSize, contentRect } = entry;

      let boxSize = contentBoxSize;

      if (useBorderBoxSize) {
        if (borderBoxSize) {
          boxSize = borderBoxSize;
        } else if (!warnedRef.current) {
          console.warn(borderBoxWarn);
          warnedRef.current = true;
        }
      }
      // @juggle/resize-observer polyfill has different data structure
      boxSize = Array.isArray(boxSize) ? boxSize[0] : boxSize;

      const width = boxSize ? boxSize.inlineSize : contentRect.width;
      const height = boxSize ? boxSize.blockSize : contentRect.height;

      if (
        width === prevSizeRef.current.width
        && height === prevSizeRef.current.height
      ) { return; }

      prevSizeRef.current = { width, height };

      const e = {
        currentBreakpoint: '',
        width,
        height,
        entry,
        observe,
        unobserve,
      };

      if (breakpoints) {
        e.currentBreakpoint = getCurrentBreakpoint(breakpoints, width);

        if (e.currentBreakpoint !== prevBreakpointRef.current) {
          if (onResizeRef.current) onResizeRef.current(e);
          prevBreakpointRef.current = e.currentBreakpoint;
        }
      } else if (onResizeRef.current) {
        onResizeRef.current(e);
      }

      setState({
        currentBreakpoint: e.currentBreakpoint,
        width,
        height,
        entry,
      });
    });

    observe();

    return () => {
      unobserve();
    };
  }, [ref, ref.current, JSON.stringify(breakpoints), observe, unobserve]);

  return {
    ref, ...state, observe, unobserve,
  };
};
