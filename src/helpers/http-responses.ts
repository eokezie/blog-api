export const successResponse = (
  message: string,
  data: object | null,
  meta?: object,
) => {
  return {
    success: true,
    message: message,
    data: data,
    meta: meta,
  };
};

export const errorResponse = (message: string, data?: any[]) => {
  return {
    success: false,
    message: message,
    data: data,
  };
};
