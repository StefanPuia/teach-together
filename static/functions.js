/*jslint browser:true*/
/* global console, _GENERIIC_PERMISSION_ERROR, _GENERIIC_ERROR, _LOGIN_REQUIRED*/
'use strict';

/**
 * make a fetch call to the server
 * @param  {String}   fetchURL      fetch URL
 * @param  {Object}   options  fetch options
 */
function callServer(fetchURL = '/api', options = {}) {
    return new Promise((resolve, reject) => {
        let type = 'json';
        if (options.responseType) {
            type = options.responseType;
            delete options.responseType;
        }

        if (options.body && (!options.method || options.method.toLowerCase() == 'get')) {
            options.method = 'post';
        }

        let showSpinner = true;
        if (typeof options.spinner !== "undefined" && options.spinner === false) {
            showSpinner = false;
            delete options.spinner;
        }

        const fetchOptions = {
            credentials: 'same-origin',
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        };

        Object.assign(fetchOptions, options);

        if (showSpinner) waitSpinner();
        fetch(fetchURL, fetchOptions)
        .then(res => {
            switch (type) {
                case 'json':
                    return res.json();

                case 'text':
                case 'html':
                    return res.text();
            }
        })
        .then(resolve)
        .catch(reject)
        .finally(() => {
            waitSpinner(false);
        });
    });
}

/**
 * Get the parameter value from an url string
 * @param  {Location} location object
 * @param  {String} parameter to search for
 * @return {String} parameter value or undefined if not found
 */
function getParameterValue(param, path) {
    path = !!path ? path : location.pathname;
    let parts = escape(path).split('/');
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] == param && parts.length > i) {
            return parts[i + 1];
        }
    }
    return undefined;
}

/**
 * Toggles the spinner
 * @param {Boolean} show 
 */
function waitSpinner(show = true) {
    if (show) {
        $("#spinner").css({display: "flex"});
    } else {
        $("#spinner").css({display: "none"});
    }
}