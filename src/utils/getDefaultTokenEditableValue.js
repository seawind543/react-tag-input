/* eslint no-unused-vars: 0 */

/**
 * Default function for TokenInput to
 * get `editable value` from customize data structure
 * for user to perform `edit` in an `HTML input element`
 *
 * getDefaultTokenEditableValue(tokenValue)
 *
 * @ tokenValue
 * Type: string | number | object | any
 * Description: The customize token data
 *
 * @ tokenMeta
 * Type: object
 * Description: The token meta
 *
 * @ return
 * Type: string
 * Description: The value for user to edit in an input
 */
const getDefaultTokenEditableValue = (tokenValue, tokenMeta) => {
  return tokenValue;
};

export default getDefaultTokenEditableValue;
