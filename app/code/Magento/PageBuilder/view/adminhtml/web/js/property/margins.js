/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Margins =
  /*#__PURE__*/
  function () {
    function Margins() {}

    var _proto = Margins.prototype;

    /**
     * Read margins from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
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

  return Object.assign(Margins, {
    __esModule: true
  });
});
//# sourceMappingURL=margins.js.map
