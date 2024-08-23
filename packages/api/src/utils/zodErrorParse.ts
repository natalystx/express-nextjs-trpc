import { ZodError, ZodIssue } from 'zod';

export function parseZodError(error: ZodError): object {
  const parsedError: object = {};

  error.issues.forEach((issue: ZodIssue) => {
    const { path, message } = issue;
    const pathArray: string[] = path.map((p) => p.toString());

    let currentObj: any = parsedError;
    pathArray.forEach((key, index) => {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }

      if (index === pathArray.length - 1) {
        currentObj[key] = message;
      }

      currentObj = currentObj[key];
    });
  });

  return parsedError;
}
