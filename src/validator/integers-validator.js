const integersValidator = (options) => {
  let result = true;
  options.forEach(num => {
    if (isNaN(parseInt(num))) {
      result = false;
    }
  });
  return result;
};

export default integersValidator;