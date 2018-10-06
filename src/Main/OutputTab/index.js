import React, { Component } from 'react';

import SandBoxContext from './../../Context/SandBoxContext';

/**
 * safely access a nested property
 * // TO_DO: Need to put this in a module.
 * @param  {Object} obj Input Object
 * @param  {String} propPath property path
 * @return {Object} Nested property or null
 */
function getNestedProp(obj, propPath) {
    if (!(typeof propPath === 'string')) {
        throw "propPath should be a string"
    }
    const [firstPath, ...restPath] = propPath.split('.');
    if (restPath.length > 0) {
        return obj[firstPath] ? getNestedProp(obj[firstPath], restPath.join('.')) : null;
    }
    return obj[firstPath];
}

let updateTimer = null;
let iframeRef = null;
/**
 *
 * // TO_DO: this method should be executed  after reloading the iframe.
 * @param  {[type]} newProps [description]
 * @return {[type]}          [description]
 */
const injectJavascript = (props) => {
    const { javascript, css, html } = props;
    if (!getNestedProp(iframeRef, 'contentWindow.document.body')) {
        return;
    }
    if (html) {
        iframeRef.contentWindow.document.body.innerHTML = html.value;
    }
    if (css) {
        const styleTag = iframeRef.contentWindow.document.createElement('style');
        styleTag.innerHTML = css.value;
        iframeRef.contentWindow.document.body.appendChild(styleTag);
    }
    if (javascript) {
        const scriptTag = iframeRef.contentWindow.document.createElement('script');
        scriptTag.innerHTML = javascript.value;
        iframeRef.contentWindow.document.body.appendChild(scriptTag);
    }
}

const OutputTabWithConsumer = (props) => {
    if (updateTimer) {
        clearTimeout(updateTimer);
    }
    updateTimer = setTimeout(() => {
        injectJavascript(props);
    }, 500);
    return (
        <div className="tab output-tab">
            <iframe
                src={`output.html`}
                ref={el => (iframeRef = el)}>
            </iframe>
        </div>
    );
}

const OutputTab = () => (
    <SandBoxContext.Consumer>
        {(props) => (<OutputTabWithConsumer {...props} />)}
    </SandBoxContext.Consumer>
);

export default OutputTab;