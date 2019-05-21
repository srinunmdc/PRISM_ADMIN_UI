const replaceDynamicVariable = (data, dynamicData) => {
  const regex = /\${\w+\}/g;
  let match = "";
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(data))) {
    let matchedString = data.substring(match.index + 2, regex.lastIndex - 1);
    if (dynamicData[matchedString]) {
      data = data.replace(
        data.substring(match.index, regex.lastIndex),
        dynamicData[matchedString]
      );
    }
  }
  return data;
};
export default replaceDynamicVariable;
