import * as CacheManager from 'cache-manager';

export function CacheClear(keyStrategy?: string | ((args: any[]) => string)): any {
  // eslint-disable-next-line func-names
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod: Function = descriptor.value;
    const className: string = target.constructor.name;
    // eslint-disable-next-line
    descriptor.value = async function (...args: any[]) {
      if (!this.cacheManager) {
        // eslint-disable-next-line no-console
        console.warn(
          `@Cache decorator: Class ${className} should have cache manager injected to cacheManager property for caching method ${methodName}`,
        );
        return originalMethod.apply(this, args);
      }

      const { cacheManager } = this;

      let cacheKey: string;
      if (keyStrategy) {
        cacheKey = typeof keyStrategy === 'function'
          ? keyStrategy(args)
          : `${keyStrategy}:${JSON.stringify(args)}`;
      } else {
        cacheKey = `${className}:${methodName}:${JSON.stringify(args)}`;
      }
      console.log(`Clear cache, key=${cacheKey}`);
      await cacheManager.del(cacheKey);

      const methodCall: any = originalMethod.apply(this, args);
      let methodResult: any;
      if (methodCall && methodCall.then) {
        methodResult = await methodCall;
      } else {
        methodResult = methodCall;
      }

      return methodResult;
    };

    return descriptor;
  };
}
