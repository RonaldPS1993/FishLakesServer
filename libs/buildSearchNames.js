const buildTokens = async (name) => {
  let results = [];
  results.push(name);
  results.push(name.split(" ").reverse().join(" "));
  const nameStrings = name.split(" ");
  const lowerCaseStrings = [];
  for (const element of nameStrings) {
    lowerCaseStrings.push(element.toLowerCase());
  }
  results.push(lowerCaseStrings.join(" "));
  results.push(lowerCaseStrings.reverse().join(" "));
  return results;
};

export { buildTokens };
