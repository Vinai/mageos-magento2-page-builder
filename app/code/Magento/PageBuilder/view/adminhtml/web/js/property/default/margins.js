/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Margins =
  /*#__PURE__*/
  function () {
    function Margins() {}

    var _proto = Margins.prototype;

    /**
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    _proto.read = function read(element) {
      return {
        margin: {
          left: element.style.marginLeft,
          top: element.style.marginTop,
          right: element.style.marginRight,
          bottom: element.style.marginBottom
        }
      };
    };

    return Margins;
  }();

  return Margins;
});
//# sourceMappingURL=margins.js.map
