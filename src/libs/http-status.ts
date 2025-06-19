type THttpStatus = {
  [key: string]: number;
};

const httpStatus: THttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  LARGE_PAYLOAD: 413,
  INTERNAL_SERVER_ERROR: 500,
};

export function getStatusText(statusCode: string) {
  if (httpStatus.hasOwnProperty(statusCode)) {
    return httpStatus[statusCode];
  } else {
    throw new Error(
      'Status not yet included in httpStatus dictionary: ' + statusCode,
    );
  }
}

export { httpStatus };
