import {
  useEffect, useRef, EffectCallback, DependencyList,
} from 'react';

export const useDidUpdateEffect = (callback: EffectCallback, deps: DependencyList) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      callback();
    } else {
      didMount.current = true;
    }
  }, deps);
};
