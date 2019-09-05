/*jslint browser:true*/
/* global console, _GENERIIC_PERMISSION_ERROR, _GENERIIC_ERROR, _LOGIN_REQUIRED*/
'use strict';

function executeScript(text, output) {
    let courseId = getParameterValue("course");
    callServer("/api/execute/" + courseId, {
        responseType: "text",
        body: JSON.stringify({
            code: text
        })
    }).then(data => {
        output.text(data);
    }).catch(err => {
        output.text(err);
    });
}