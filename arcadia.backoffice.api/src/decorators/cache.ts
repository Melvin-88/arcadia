export function Cache(options?: any): any {
  // eslint-disable-next-line func-names
  return function (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod: Function = descriptor.value;
    const className: string = target.constructor.name;
    // eslint-disable-next-line func-names
    descriptor.value = async function (...args: any[]) {
      if (!this.cacheManager) {
        console.warn(
          `@Cache decorator: Class ${className} should have cache manager injected to cacheManager property for caching method ${methodName}`,
        );
        return originalMethod.apply(this, args);
      }

      const { CacheType: cacheManager } = this;
      const cacheKey: string = `${className}:${methodName}:${JSON.stringify(
        args,
      )}`;

      const entry: any = await cacheManager.get(cacheKey);
      if (entry) {
        return entry;
      }

      const methodCall: any = originalMethod.apply(this, args);
      let methodResult: any;
      if (methodCall && methodCall.then) {
        methodResult = await methodCall;
      } else {
        methodResult = methodCall;
      }

      await cacheManager.set(cacheKey, methodResult, options);
      return methodCall;
    };

    return descriptor;
  };
}
