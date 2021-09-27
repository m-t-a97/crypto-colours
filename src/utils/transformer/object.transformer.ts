export class ObjectTransformer {
  public static extractOnlyNAN<T>(data: Record<string, any>): T {
    const indexableType: Record<string, any> = {};

    for (const key of Object.keys(data)) {
      if (isNaN(parseInt(key))) {
        indexableType[key] = data[key];
      }
    }

    return indexableType as T;
  }
}
