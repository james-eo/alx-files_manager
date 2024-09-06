import { promisify } from 'util';

const promisifyAll = (client, methods) => {
  const newClient = client;
  methods.forEach((method) => {
    const newMethodName = `${method}Async`;
    newClient[newMethodName] = promisify(newClient[method]).bind(newClient);
  });
  return newClient;
};

module.exports = promisifyAll;
