/**
 * Function to camelize a string ex: importParamenter
 * @param {string} str string to camelize
 * @returns {string} camelized string
 */
export const camelize = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * Function to register a web-component in the DOM
 * @param {string} tag tag name of the web-component
 * @param {CustomElementConstructor} component class of the web-component
 */
export const register = (tag: string, component: CustomElementConstructor) => {
  if (document.createElement(tag).constructor === HTMLElement) {
    window.customElements.define(tag, component);
  }
};

/**
 * Function to register list of web-components in an object being the key the tag and the value the class of the webcomopnent
 * @param elements object with the web-components
 */
export const scopedElements = (elements: { [key: string]: CustomElementConstructor }) => {
  Object.entries(elements).forEach(([key, element]) => {
    register(key, element);
  });
};

/**
 * Function to generate markdown documentation based on readme, changelog and package.json
 * @param {string} readme readme file
 * @param {string} changelog changelog file
 * @param {object} packagejson package.json file in json format
 * @returns {string} String with the whole documentation in markdown notation
 */
export const generateDocs = (
  readme: string,
  changelog: string,
  packagejson: {
    private: boolean;
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
  }
): string => {
  let result = readme || '';
  if (packagejson && packagejson.name && changelog) {
    result = result.concat(changelog.replace(packagejson.name, 'Changelog'));
  }
  return result;
};
