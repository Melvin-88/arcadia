import React, {
  RefObject, useCallback, useEffect, useImperativeHandle, useRef,
} from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import './spineCanvas';
import { loadSkeleton } from './helpers';
import { BASE_ANIMATIONS_PATH } from './constants';
import {
  getClassNames, getStyles, ISpineAnimationStyleProps, ISpineAnimationStyles,
} from './styles/SpineAnimation';

// TODO: Complete all types

export interface ISpineAnimationImperativeHandleRef {
  addAnimation: (trackIndex: number, animationName: string, loop: boolean, delay: number) => spine.TrackEntry | null;
  setAnimation: (trackIndex: number, animationName: string, loop: boolean) => spine.TrackEntry | null;
}

export interface ISpineAnimationProps extends Partial<ISpineAnimationStyleProps> {
  styles?: IStyleFunctionOrObject<ISpineAnimationStyleProps, ISpineAnimationStyles>;
  skeletonName: string;
  isDebugMode?: boolean;
  imperativeHandleRef?: RefObject<ISpineAnimationImperativeHandleRef>;
  onLoadComplete?: () => void;
  onAnimationComplete?: (track: spine.TrackEntry) => void;
}

export const SpineAnimationBase: React.FC<ISpineAnimationProps> = ({
  styles,
  className,
  skeletonName,
  isDebugMode = false,
  imperativeHandleRef,
  onLoadComplete,
  onAnimationComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const assetManagerRef = useRef<any>(null);
  const skeletonRef = useRef<any>(null);
  const skeletonRendererRef = useRef<any>(null);
  const boundsRef = useRef<any>(null);
  const animationStateRef = useRef<spine.AnimationState | null>(null);
  const lastFrameTimeRef = useRef(Date.now() / 1000);

  const setCanvasSizes = useCallback(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const canvasClientWidth = canvas.clientWidth;
      const canvasClientHeight = canvas.clientHeight;

      if (canvas.width !== canvasClientWidth || canvas.height !== canvasClientHeight) {
        canvas.width = canvasClientWidth;
        canvas.height = canvasClientHeight;
      }
    }
  }, [canvasRef.current]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const bounds = boundsRef.current;

    if (canvas && bounds) {
      const context = canvas.getContext('2d')!;

      setCanvasSizes();

      const centerX = bounds.offset.x + bounds.size.x / 2;
      const centerY = bounds.offset.y + bounds.size.y / 2;
      const scaleX = bounds.size.x / canvas.width;
      const scaleY = bounds.size.y / canvas.height;
      const scale = Math.max(scaleX, scaleY) * 1.05;

      const width = canvas.width * scale;
      const height = canvas.height * scale;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(1 / scale, 1 / scale);
      context.translate((centerX / scale), (centerY / scale));
      context.translate(width / 2, height / 2);
    }
  }, [canvasRef.current, boundsRef.current]);

  const render = useCallback(() => {
    const skeleton = skeletonRef.current;
    const canvas = canvasRef.current;
    const animationState = animationStateRef.current;

    if (skeleton && canvas && animationState) {
      const context = canvas.getContext('2d')!;
      const now = Date.now() / 1000;
      const delta = now - lastFrameTimeRef.current;

      lastFrameTimeRef.current = now;

      resize();

      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();

      animationState.update(delta);
      animationState.apply(skeleton);

      skeleton.updateWorldTransform();
      skeletonRendererRef.current.draw(skeleton);

      requestAnimationFrame(render);
    }
  }, [skeletonRef.current, canvasRef.current, animationStateRef.current, lastFrameTimeRef.current, skeletonRendererRef.current]);

  const handleAnimationComplete = useCallback((track: spine.TrackEntry) => {
    if (onAnimationComplete) {
      onAnimationComplete(track);
    }
  }, [onAnimationComplete]);

  const load = useCallback(() => {
    const assetManager = assetManagerRef.current;

    if (assetManager?.isLoadingComplete()) {
      const { skeleton, animationState, bounds } = loadSkeleton(
        assetManager,
        skeletonName,
      );

      animationState.addListener({
        event: () => {},
        start: () => {},
        end: () => {},
        interrupt: () => {},
        dispose: () => {},
        complete: handleAnimationComplete,
      });

      skeletonRef.current = skeleton;
      animationStateRef.current = animationState;
      boundsRef.current = bounds;

      if (onLoadComplete) {
        onLoadComplete();
      }

      requestAnimationFrame(render);
    } else {
      requestAnimationFrame(load);
    }
  }, [skeletonRef.current, animationStateRef.current, boundsRef.current, skeletonName, handleAnimationComplete, onLoadComplete]);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      setCanvasSizes();

      const skeletonRenderer = new spine.canvas.SkeletonRenderer(context);

      // enable debug rendering
      skeletonRenderer.debugRendering = isDebugMode;
      // enable the triangle renderer, supports meshes, but may produce artifacts in some browsers
      skeletonRenderer.triangleRendering = false;

      skeletonRendererRef.current = skeletonRenderer;

      const assetManager = new spine.canvas.AssetManager();

      assetManager.loadText(`${BASE_ANIMATIONS_PATH}${skeletonName}.json`);
      assetManager.loadText(`${BASE_ANIMATIONS_PATH}${skeletonName}.atlas`);
      assetManager.loadTexture(`${BASE_ANIMATIONS_PATH}${skeletonName}.png`);

      assetManagerRef.current = assetManager;

      requestAnimationFrame(load);
    }
  }, [skeletonName, canvasRef.current, assetManagerRef.current, setCanvasSizes, isDebugMode]);

  useImperativeHandle(
    imperativeHandleRef,
    () => ({
      addAnimation: (...args) => {
        if (animationStateRef.current) {
          return animationStateRef.current.addAnimation(...args);
        }

        return null;
      },
      setAnimation: (...args) => {
        if (animationStateRef.current) {
          return animationStateRef.current.setAnimation(...args);
        }

        return null;
      },
    }),
    [animationStateRef.current],
  );

  useEffect(() => {
    init();
  }, [skeletonName, isDebugMode]);

  const classNames = getClassNames(styles, {
    className,
  });

  return (
    <div className={classNames.root}>
      <canvas ref={canvasRef} className={classNames.canvas} />
    </div>
  );
};

export const SpineAnimation = React.memo(
  styled<
    ISpineAnimationProps,
    ISpineAnimationStyleProps,
    ISpineAnimationStyles
  >(
    SpineAnimationBase,
    getStyles,
  ),
);
