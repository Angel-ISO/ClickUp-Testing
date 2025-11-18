const result = {
  ok: (value) => ({
    success: true,
    value,
    is_ok: () => true,
    is_error: () => false,
  }),

  error: (error_msg) => ({
    success: false,
    error: error_msg,
    is_ok: () => false,
    is_error: () => true,
  }),

  map: (result_obj, fn) => result_obj.success ? result.ok(fn(result_obj.value)) : result_obj,

  chain: (result_obj, fn) => result_obj.success ? fn(result_obj.value) : result_obj,

  get_or_else: (result_obj, default_value) => result_obj.success ? result_obj.value : default_value,

  fold: (result_obj, on_error, on_success) => result_obj.success ? on_success(result_obj.value) : on_error(result_obj.error),
};

export default result;