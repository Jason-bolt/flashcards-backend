class GenericHelper {
  static sendGraphQLResponse<T>(
    status: number,
    message: string,
    data: T
  ): { status: number; message: string; data: T } {
    return {
      status,
      message,
      data,
    };
  }

  static errorResponse<T>(
    status: number,
    error: string | { message: string }
  ): { status: number; message: string; data: any } {
    if (
      status === 500 &&
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      return GenericHelper.sendGraphQLResponse<any>(
        status,
        error?.message as string,
        error
      );
    }
    return GenericHelper.sendGraphQLResponse<any>(
      status,
      error as string,
      null
    );
  }
}

export default GenericHelper;
