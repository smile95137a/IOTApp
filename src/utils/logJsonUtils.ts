export const logJson = <T>(label: string, data?: T): void => {
  if (data === null || data === undefined) {
    console.log(`[${label}]`);
  } else if (data instanceof Error) {
    console.log(`[${label}]`, data.message, data.stack);
  } else {
    console.log(`[${label}]`, JSON.stringify(data, null, 2));
  }
};
