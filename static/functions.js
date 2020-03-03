/*jslint browser:true*/
/* global console, _GENERIIC_PERMISSION_ERROR, _GENERIIC_ERROR, _LOGIN_REQUIRED*/
'use strict';

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