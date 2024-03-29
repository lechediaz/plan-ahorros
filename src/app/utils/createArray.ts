/**
 * Creates an array depending the length given.
 * @param length The array length.
 * @returns New array.
 */
export const createArray = (length: number = 10) => {
  let newArray = [];

  for (let index = 0; index < length; index++) {
    newArray.push(index);
  }

  return newArray;
};

export default createArray;
