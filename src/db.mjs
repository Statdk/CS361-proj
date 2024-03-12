//@ts-check

const serverPort = 2013

/**
 * 
 * @param {String} endpoint 
 * @param {{type: String, isPrime: Boolean|undefined}} params Object to send in URL params
 * @returns 
 */
function buildUrl(endpoint, params) {
  let url = `http://127.0.0.1:${serverPort}/${endpoint}`;
  let pass = 0;
  for (const key in params) {
    if (params[key] !== undefined) {
      url += pass === 0 ? (() => { pass++; return "?" })() : "&";
      url += `${key}=${params[key]}`;
    }
  }

  console.log(url);

  return url;
}

/**
 * Gets from db
 * @param {{type: String, isPrime: Boolean|undefined}} params Object to send in URL params
 * @returns {Promise<[{}]>} List of results
 */
async function dbGet(params) {
  let url = buildUrl("request", params);

  return await fetch(url).then(res => res.json()).then((data) => {
    return data;
  }).catch((err) => {
    console.error("Fetch Error:", err);
    (async () => {
      alert("Fetch Error! (is the service running?)");
    })();
    return undefined;
  });
}

/**
 * Get all equipment
 * @param {Boolean} isPrime Set prime query 
 * @returns {Promise<[{}]>} List of results
 */
async function getEquip(isPrime) {
  return await dbGet({ type: "equipment", isPrime: isPrime });
}

/**
 * Get all relics
 * @returns {Promise<[{}]>} List of results
 */
async function getRelics() {
  return await dbGet({ type: "relics", isPrime: undefined });
}

/**
 * 
 * @param {[{}]} list List to sort
 * @param {String} property Property to filter by
 * @param {String} expression Search String
 */
function filter(list, property, expression) {
  let outList = [];

  list.forEach((obj) => {
    if (obj[property] === undefined) {
      console.error("Filter undefined:", property);
      return;
    }
    if (String(obj[property]).toLowerCase()
      .includes(String(expression).toLowerCase())) {
      outList.push(obj);
    }
  })

  return outList;
}

export { getEquip, getRelics, filter }