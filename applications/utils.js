const isAsyncronous = fn => fn && fn.constructor.name === 'AsyncFunction';

export { isAsyncronous };