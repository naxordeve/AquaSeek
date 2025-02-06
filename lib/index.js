const fs = require("fs");

function extractUrlFromText(text) {
    const voidi = /https?:\/\/[^\s]+/g;
    const matches = text.match(voidi);
    return matches || [];
}


module.exports = { extractUrlFromText };
