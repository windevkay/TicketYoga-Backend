// eslint-disable-next-line @typescript-eslint/ban-types
export function log(target: Object, propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function (...args: any[]) {
        console.log(
            `${propertyKey} method called with args: 
             ${JSON.stringify(args)}`,
        );
        const result = originalMethod.apply(this, args);
        //log result of method
        console.log(
            `${propertyKey} method return value: 
          ${JSON.stringify(result)}`,
        );
    };
}
