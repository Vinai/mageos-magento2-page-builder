/*eslint-disable */
define(["../../../component/config", "../../../utils/image", "../../../utils/url"], function (_config, _image, _url) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Src =
  /*#__PURE__*/
  function () {
    function Src() {}

    var _proto = Src.prototype;

    /**
     * @param {string} value
     * @returns {Object | string}
     */
    _proto.fromDom = function fromDom(value) {
      return (0, _image.decodeUrl)(value);
    };
    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */


    _proto.toDom = function toDom(name, data) {
      var value = data[name];

      if (value[0] === undefined || value[0].url === undefined) {
        return null;
      }

      var imageUrl = value[0].url;
      var mediaUrl = (0, _url.convertUrlToPathIfOtherUrlIsOnlyAPath)(_config.getInitConfig("media_url"), imageUrl);
      var mediaPath = imageUrl.split(mediaUrl);
      return "{{media url=" + mediaPath[1] + "}}";
    };

    return Src;
  }();

  return Src;
});
//# sourceMappingURL=src.js.map
