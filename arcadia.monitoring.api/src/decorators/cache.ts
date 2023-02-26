import * as CacheManager from 'cache-manager';

export function Cache(options?: any, keyStrategy?: string | ((args: any[]) => string)): any {
  // eslint-disable-next-line func-names
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod: Function = descriptor.value;
    const className: string = target.constructor.name;
    // eslint-disable-next-line
    descriptor.value = async function (...args: any[]) {
      if (!this.cacheManager) {
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

      const entry: any = await cacheManager.get(cacheKey);
      if (entry) {
        console.log(`Taking from cache, key=${cacheKey}`);
        return entry;
      }

      console.log(`Taking from DB, key=${cacheKey}`);
      const methodCall: any = originalMethod.apply(this, args);
      let methodResult: any;
      if (methodCall && methodCall.then) {
        methodResult = await methodCall;
      } else {
        methodResult = methodCall;
      }
      if (methodResult) {
        await cacheManager.set(cacheKey, methodResult, options);
      }
      return methodCall;
    };

    return descriptor;
  };
}
