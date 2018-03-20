/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ButtonOpacity =
  /*#__PURE__*/
  function () {
    function ButtonOpacity() {}

    var _proto = ButtonOpacity.prototype;

    /**
     * @param {string} value
     * @returns {Object | string}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    };
    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */


    _proto.toDom = function toDom(name, data) {
      return data.show_button === "always" ? "1" : "0";
    };

    return ButtonOpacity;
  }();

  return ButtonOpacity;
});
//# sourceMappingURL=button-opacity.js.map
