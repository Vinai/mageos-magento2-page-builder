/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "./property-reader-pool", "../config"], function (_loader, _propertyReaderPool, _config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of converter pool
   */
  function create(contentType) {
    var config = _config.getContentType(contentType);

    var properties = [];

    for (key in config.appearances) {
      var dataMapping = config.appearances[key].data_mapping;

      if (dataMapping !== undefined && dataMapping.elements !== undefined) {
        for (var elementName in dataMapping.elements) {
          if (dataMapping.elements[elementName].style !== undefined) {
            for (var i = 0; i < dataMapping.elements[elementName].style.length; i++) {
              var styleProperty = dataMapping.elements[elementName].style[i];

              if (!!styleProperty.complex && properties.indexOf(styleProperty.reader) == -1 && !_propertyReaderPool.get(styleProperty.reader)) {
                properties.push(styleProperty.reader);
              }
            }
          }

          if (dataMapping.elements[elementName].attributes !== undefined) {
            for (var _i = 0; _i < dataMapping.elements[elementName].attributes.length; _i++) {
              var attributeProperty = dataMapping.elements[elementName].attributes[_i];

              if (!!attributeProperty.complex && properties.indexOf(attributeProperty.reader) == -1 && !_propertyReaderPool.get(attributeProperty.reader)) {
                properties.push(attributeProperty.reader);
              }
            }
          }
        }
      }
    }

    return new Promise(function (resolve) {
      (0, _loader)(properties, function () {
        for (var _len = arguments.length, loadedProperties = new Array(_len), _key = 0; _key < _len; _key++) {
          loadedProperties[_key] = arguments[_key];
        }

        for (var _i2 = 0; _i2 < properties.length; _i2++) {
          _propertyReaderPool.register(properties[_i2], new loadedProperties[_i2]());
        }

        resolve(_propertyReaderPool);
      });
    });
  }

  return create;
});
//# sourceMappingURL=property-reader-pool-factory.js.map
