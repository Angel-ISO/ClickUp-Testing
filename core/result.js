const result = {
  ok: (value) => ({
    success: true,
    value,
    isOk: () => true,
    isError: () => false,
  }),

  error: (errorMsg) => ({
    success: false,
    error: errorMsg,
    isOk: () => false,
    isError: () => true,
  }),

  map: (resultObj, fn) => resultObj.success ? result.ok(fn(resultObj.value)) : resultObj,

  chain: (resultObj, fn) => resultObj.success ? fn(resultObj.value) : resultObj,

  getOrElse: (resultObj, defaultValue) => resultObj.success ? resultObj.value : defaultValue,

  fold: (resultObj, onError, onSuccess) => resultObj.success ? onSuccess(resultObj.value) : onError(resultObj.error),
};

module.exports = result;