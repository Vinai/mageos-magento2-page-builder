/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import mageUtils from "mageUtils";
import _ from "underscore";
import appearanceConfig from "../../content-type/appearance-config";
import PropertyReaderPool from "../../converter/converter-pool";
import ConverterPool from "../../converter/converter-pool";
import converterPoolFactory from "../../converter/converter-pool-factory";
import MassConverterPool from "../../mass-converter/converter-pool";
import massConverterPoolFactory from "../../mass-converter/converter-pool-factory";
import propertyReaderPoolFactory from "../../property/property-reader-pool-factory";
import {ReadInterface} from "../read-interface";

/**
 * @api
 */
export default class Configurable implements ReadInterface {

    /**
     * Read data from the dom based on configuration
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const role = element.getAttribute("data-role");
        const config = appearanceConfig(role, element.getAttribute("data-appearance"));
        const componentsPromise: Array<Promise<any>> = [
            propertyReaderPoolFactory(role),
            converterPoolFactory(role),
            massConverterPoolFactory(role),
        ];
        return new Promise((resolve: (data: object) => void) => {
            Promise.all(componentsPromise).then((loadedComponents) => {
                const [propertyReaderPool, converterPool, massConverterPool] = loadedComponents;
                let data = {};
                for (const elementName of Object.keys(config.elements)) {
                    const elementConfig = config.elements[elementName];
                    const currentElement = element.getAttribute("data-element") === elementName
                        ? element
                        : element.querySelector<HTMLElement>("[data-element = '" + elementName + "']");

                    if (currentElement === null || currentElement === undefined) {
                        continue;
                    }
                    if (elementConfig.style.length) {
                        data = this.readStyle(
                            elementConfig.style,
                            currentElement,
                            data,
                            propertyReaderPool,
                            converterPool,
                        );
                    }
                    if (elementConfig.attributes.length) {
                        data = this.readAttributes(
                            elementConfig.attributes,
                            currentElement,
                            data,
                            propertyReaderPool,
                            converterPool,
                        );
                    }
                    if (undefined !== elementConfig.html.var) {
                        data = this.readHtml(elementConfig, currentElement, data, converterPool);
                    }
                    if (undefined !== elementConfig.tag.var) {
                        data = this.readHtmlTag(elementConfig, currentElement, data);
                    }
                    if (undefined !== elementConfig.css.var) {
                        data = this.readCss(elementConfig, currentElement, data);
                    }
                }
                data = this.convertData(config, data, massConverterPool);
                resolve(data);
            }).catch((error) => {
                console.error(error);
            });
        });
    }

    /**
     * Read attributes for element
     *
     * @param {object} config
     * @param {HTMLElement} element
     * @param {object} data
     * @param {typeof PropertyReaderPool} propertyReaderPool
     * @param {typeof ConverterPool} converterPool
     * @returns {any}
     */
    private readAttributes(
        config: object,
        element: HTMLElement,
        data: object,
        propertyReaderPool: typeof PropertyReaderPool,
        converterPool: typeof ConverterPool,
    ) {
        const result: {[key: string]: string} = {};
        for (const attributeConfig of config) {
            if ("write" === attributeConfig.persistence_mode) {
                continue;
            }
            let value = !!attributeConfig.static
                ? attributeConfig.value
                : propertyReaderPool.get(attributeConfig.reader).read(element, attributeConfig.name);
            if (converterPool.get(attributeConfig.converter)) {
                value = converterPool.get(attributeConfig.converter).fromDom(value);
            }
            if ($.type(result[attributeConfig.var]) === "object") {
                value = mageUtils.extend(
                    {[attributeConfig.name]: value},
                    result[attributeConfig.var],
                );
            }
            result[attributeConfig.var] = value;
        }
        return _.extend(data, result);
    }

    /**
     * Read style properties for element
     *
     * @param {object} config
     * @param {HTMLElement} element
     * @param {object} data
     * @param {typeof PropertyReaderPool} propertyReaderPool
     * @param {typeof ConverterPool} converterPool
     * @returns {object}
     */
    private readStyle(
        config: object,
        element: HTMLElement,
        data: object,
        propertyReaderPool: typeof PropertyReaderPool,
        converterPool: typeof ConverterPool,
    ) {
        const result: {[key: string]: string} = _.extend({}, data);
        for (const propertyConfig of config) {
            if ("write" === propertyConfig.persistence_mode) {
                continue;
            }
            let value = !!propertyConfig.static
                ? propertyConfig.value
                : propertyReaderPool.get(propertyConfig.reader).read(element, propertyConfig.name);
            if (converterPool.get(propertyConfig.converter)) {
                value = converterPool.get(propertyConfig.converter).fromDom(value);
            }
            if ($.type(result[propertyConfig.var]) === "object") {
                value = mageUtils.extend(result[propertyConfig.var], value);
            }
            result[propertyConfig.var] = value;
        }
        return result;
    }

    /**
     * Read element's tag
     *
     * @param {object} config
     * @param {HTMLElement} element
     * @param {object} data
     * @returns {object}
     */
    private readHtmlTag(config: any, element: HTMLElement, data: object) {
        const result: {[key: string]: string} = {};
        result[config.tag.var] = element.nodeName.toLowerCase();
        return _.extend(data, result);
    }

    /**
     * Read element's css
     *
     * @param {object} config
     * @param {HTMLElement} element
     * @param {object} data
     * @returns {object}
     */
    private readCss(config: any, element: HTMLElement, data: object) {
        const result: {[key: string]: string} = {};
        let css: string = element.getAttribute("class") !== null
            ? element.getAttribute("class")
            : "";
        if (config.css !== undefined
            && config.css.filter !== undefined
            && config.css.filter.length
        ) {
            for (const filterClass of config.css.filter) {
                css = css.replace(filterClass, "");
            }
        }
        result[config.css.var] = css.replace(/\s{2,}/g, " ").trim();
        return _.extend(data, result);
    }

    /**
     * Read element's content
     *
     * @param config
     * @param {HTMLElement} element
     * @param {object} data
     * @param {typeof ConverterPool} converterPool
     * @returns {object}
     */
    private readHtml(config: any, element: HTMLElement, data: object, converterPool: typeof ConverterPool) {
        const result: {[key: string]: string} = {};
        let value = element.innerHTML;

        if (converterPool.get(config.html.converter)) {
            value = converterPool.get(config.html.converter).fromDom(value);
        }

        result[config.html.var] = value;
        return _.extend(data, result);
    }

    /**
     * Convert data after it's read for all elements
     *
     * @param config
     * @param {object} data
     * @param {typeof MassConverterPool} massConverterPool
     * @returns {object}
     */
    private convertData(config: any, data: object, massConverterPool: typeof MassConverterPool) {
        for (const converterConfig of config.converters) {
            if (massConverterPool.get(converterConfig.component)) {
                data = massConverterPool.get(converterConfig.component).fromDom(
                    data,
                    converterConfig.config,
                );
            }
        }
        return data;
    }
}
