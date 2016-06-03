let properties = [];
for (let i = 0; i < 10; ++i) {
  properties.push('t' + i);
}

export function generateObj(initVal) {
  let obj = {};
  properties.forEach((key) => {
    obj[key] = initVal;
  });
  return obj;
}

export function generateObjWithFn(fn) {
  let obj = {};
  properties.forEach((key) => {
    obj[key] = fn();
  });
  return obj;
}

export function generateObjWithConstructor(fn) {
  let obj = {};
  properties.forEach((key) => {
    obj[key] = new fn();
  });
  return obj;
}
