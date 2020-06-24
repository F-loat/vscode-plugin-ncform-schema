export const form2drag = (properties) => {
  if (typeof properties !== 'object') {
    return [];
  } else {
    return Object.keys(properties).map(curKey => {
      const curVal = properties[curKey];
      const result = { ...curVal, key: curKey };

      if (curVal.type === 'array' && curVal.items) {
        const { items } = curVal;

        if (items.type === 'object') {
          result.items.properties = form2drag(items.properties);
        } else if (items.type === 'array') {
          result.items.items = form2drag(items.items);
        }
      } else if (curVal.type === 'object') {
        result.properties = form2drag(curVal.properties);
      }

      return result;
    });
  }
};

export const drag2form = (properties) => {
  if (!Array.isArray(properties)) {
    return {};
  } else {
    return properties.reduce((result, curVal) => {
      const curKey = curVal.key;
      const nextRst = { ...result };

      nextRst[curKey] = {
        ...curVal,
        key: undefined,
        checked: undefined
      };

      if (curVal.type === 'array' && curVal.items) {
        const { items } = curVal;

        if (items.type === 'object') {
          nextRst[curKey].items.properties = drag2form(items.properties);
        } else if (items.type === 'array') {
          nextRst[curKey].items.items = drag2form(items.items);
        }
      } else if (curVal.type === 'object') {
        nextRst[curKey].properties = drag2form(curVal.properties);
      }

      return nextRst;
    }, {});
  }
};

export const genHelpConfig = (content, text = '?') => {
  return {
    show: true,
    content: text === 'd' ? `${content}【支持dx表达式】` : content,
    text
  };
};
