const getType = method => {
  if (method.requestStream === false && method.responseStream === false) {
    return 'unary';
  }
  return 'unknown';
};

const lookupServiceMetadata = (service, implementation) => {
  const serviceKeys = Object.keys(service);
  const implementationKeys = Object.keys(implementation);
  const intersectingMethods = serviceKeys
    .filter(k => {
      return implementationKeys.map(k => k).indexOf(k) !== -1;
    })
    .reduce((acc, k) => {
      const method = service[k];
      if (!method) {
        throw new Error(`cannot find method ${k} on service`);
      }
      const components = method.path.split('/');
      acc[k] = {
        name: components[1],
        method: components[2],
        type: getType(method),
        path: method.path,
        responseType: method.responseType,
        requestType: method.requestType,
      };
      return acc;
    }, {});

  return key => {
    return Object.keys(intersectingMethods)
      .filter(k => key === k)
      .map(k => intersectingMethods[k]).pop();
  };
};

module.exports = {
  lookupServiceMetadata,
};
