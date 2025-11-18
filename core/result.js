const Result = {
  ok: (value) => ({
    success: true,
    value,
    isOk: () => true,
    isError: () => false,
  }),

  error: (error) => ({
    success: false,
    error,
    isOk: () => false,
    isError: () => true,
  }),

  map: (result, fn) => result.success ? Result.ok(fn(result.value)) : result,

  chain: (result, fn) => result.success ? fn(result.value) : result,

  getOrElse: (result, defaultValue) => result.success ? result.value : defaultValue,

  fold: (result, onError, onSuccess) => result.success ? onSuccess(result.value) : onError(result.error),
};

export default Result;