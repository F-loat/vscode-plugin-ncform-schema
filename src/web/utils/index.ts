export const form2drag = (properties: any) => {
  if (typeof properties !== 'object') {
    return [];
  }
  return Object.keys(properties).map((curKey) => {
    const curVal = properties[curKey];
    const result = { ...curVal, key: curKey };

    if (curVal.items) {
      const { items } = curVal;

      if (curVal.items.properties) {
        result.items.properties = form2drag(items.properties);
      } else if (curVal.items.items) {
        result.items.items = form2drag(items.items);
      }
    } else if (curVal.properties) {
      result.properties = form2drag(curVal.properties);
    }

    return result;
  });
};

export const drag2form = (properties: any) => {
  if (!Array.isArray(properties)) {
    return {};
  }
  return properties.reduce((result, curVal) => {
    const curKey = curVal.key;
    const nextRst = { ...result };

    nextRst[curKey] = {
      ...curVal,
      key: undefined,
    };

    if (curVal.items) {
      const { items } = curVal;

      if (curVal.items.properties) {
        nextRst[curKey].items.properties = drag2form(items.properties);
      } else if (curVal.items.items) {
        nextRst[curKey].items.items = drag2form(items.items);
      }
    } else if (curVal.properties) {
      nextRst[curKey].properties = drag2form(curVal.properties);
    }

    return nextRst;
  }, {});
};

export const genHelpConfig = (content: string, text = '?') => ({
  show: true,
  content: text === 'd' ? `${content}【支持dx表达式】` : content,
  text,
});
