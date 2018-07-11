/**
 *
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/form/element/image-uploader',
    'jquery'
], function (ImageUploader, $) {
    'use strict';

    var uploader,
        modifierClassSet1 = {
            'foo': {
                minWidth: 1000
            },
            'bar': {
                minWidth: 3000
            },
            'baz': {
                minWidth: 100,
                maxWidth: 200
            },
            'bash': {
                maxWidth: 50
            }
        },
        scenarios = [
            {
                config: modifierClassSet1,
                elementWidth: 1000,
                expectedClasses: 'foo'
            },
            {
                config: modifierClassSet1,
                elementWidth: 1500,
                expectedClasses: 'foo'
            },
            {
                config: modifierClassSet1,
                elementWidth: 3100,
                expectedClasses: 'foo bar'
            },
            {
                config: modifierClassSet1,
                elementWidth: 100,
                expectedClasses: 'baz'
            },
            {
                config: modifierClassSet1,
                elementWidth: 200,
                expectedClasses: 'baz'
            },
            {
                config: modifierClassSet1,
                elementWidth: 10,
                expectedClasses: 'bash'
            },
            {
                config: modifierClassSet1,
                elementWidth: 50,
                expectedClasses: 'bash'
            }
        ];

    beforeEach(function () {
        /**
         * A stub constructor to bypass the original
         * @constructor
         */
        var MockUploader = function () {};

        MockUploader.prototype = Object.create(ImageUploader.prototype);
        MockUploader.prototype.constructor = MockUploader;
        uploader = new MockUploader();
        uploader.$uploadArea = $('<div/>');
    });

    describe('Magento_PageBuilder/js/form/element/image-uploader', function () {
        describe('updateResponsiveClasses', function () {
            it('Should do nothing when element is not visible', function () {
                spyOn(uploader.$uploadArea, 'is').and.returnValue(false);
                spyOn(uploader.$uploadArea, 'removeClass');
                spyOn(uploader.$uploadArea, 'addClass');

                uploader.updateResponsiveClasses();

                // None of the algorithm should have been attempted
                expect(uploader.$uploadArea.addClass).not.toHaveBeenCalled();
                expect(uploader.$uploadArea.removeClass).not.toHaveBeenCalled();
            });
            it('Attempts to remove all defined modifier classes', function () {
                uploader.elementWidthModifierClasses = {
                    'foo': {},
                    'bar': {}
                };
                spyOn(uploader.$uploadArea, 'is').and.returnValue(true);
                spyOn(uploader.$uploadArea, 'removeClass');

                uploader.updateResponsiveClasses();

                expect(uploader.$uploadArea.removeClass).toHaveBeenCalledWith('foo bar');
            });

            $.each(scenarios, function (i, scenario) {
                it('Should add modifier classes if configuration is met in scenario ' + i, function () {
                    uploader.elementWidthModifierClasses = scenario.config;
                    spyOn(uploader.$uploadArea, 'is').and.returnValue(true);
                    spyOn(uploader.$uploadArea, 'width').and.returnValue(scenario.elementWidth);
                    spyOn(uploader.$uploadArea, 'addClass');

                    uploader.updateResponsiveClasses();

                    expect(uploader.$uploadArea.addClass).toHaveBeenCalledWith(scenario.expectedClasses);
                });
            });
        });
    });
});
