export function CacheClear(method?: string): any {
  return function clear(
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod: Function = descriptor.value;
    const className: string = target.constructor.name;
    descriptor.value = async function cacheLogic(...args: any[]) {
      if (!this.cacheManager) {
        console.warn(
          `@Cache decorator: Class ${className} should have cache manager injected to cacheManager property for caching method ${methodName}`,
        );
        return originalMethod.apply(this, args);
      }

      const { cacheManager } = this;
      const cacheKey: string = `${className}:${method || methodName}:${JSON.stringify(
        args,
      )}`;

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
