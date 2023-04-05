/**
 *
 * This file can be used to enable you to convert 3.0 VCARD files into 2.1 VCARD files
 * for old "PHONELINE" phones!
 * 
 * Note: use https://en.wikipedia.org/wiki/VCard for more info on VCARDs!
 * 
 * Note: Support only for name, full name, and cell numbers!
 * 
 **/

// Sample of valid VCARD for PHONELINE:
//
// BEGIN:VCARD
// VERSION:2.1
// N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:;Test;;;
// FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:Test
// TEL;CELL:0000000000
// END:VCARD
// BEGIN:VCARD
// VERSION:2.1
// N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:;Test;;;
// FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:Test
// TEL;CELL:0000000001
// END:VCARD
// BEGIN:VCARD
// VERSION:2.1
// N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:;=D7=94=D7=A7=D7=A9=D7=A8 =D7=A9=D7=9C=D7=99;;;
// FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:=D7=94=D7=A7=D7=A9=D7=A8 =D7=A9=D7=9C=D7=99
// TEL;CELL:0000000000
// END:VCARD

// Same sample in VCARD 3.0 format:
//
// BEGIN:VCARD
// VERSION:3.0
// FN:Test
// N:Test
// TEL;TYPE=CELL:0000000000
// END:VCARD
// 
// BEGIN:VCARD
// VERSION:3.0
// FN:Test
// N:Test
// TEL;TYPE=CELL:0000000001
// END:VCARD
// 
// BEGIN:VCARD
// VERSION:3.0
// FN:הקשר שלי
// N:הקשר שלי
// TEL;TYPE=CELL:0000000000
// END:VCARD


// Encode the name to fit the format
// Use this to avoid missing contacts if you use a language other than English!
function encodeName(str) {
    return encodeURI(str).replace(/%{1}/g, '=').replace(/=20/, " ");
}

// Fix the cell number data
function fixCell(vcard) {
    return vcard.replaceAll("TEL;TYPE=CELL:", "TEL;CELL:");
}

// Fix the name (+full name) data
function fixName(vcard) {
    let newData = vcard;
    // Fix data
    newData = newData.replace(/^FN(:.*\n)/gm, function(match, capture) {
        // trim capture
        capture = capture.substring(1).replace(/\n/g, "");
        // Return new data
        return `FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:${encodeName(capture)}\n`;
    });
    newData = newData.replace(/^N(:.*\n)/gm, function(match, capture) {
        // trim capture
        capture = capture.substring(1).replace(/\n/g, "");
        // Return new data
        return `N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:;${encodeName(capture)};;;\n`;
    });
    // Re-order data
    // (otherwise, the phone won't accept the import for some reason??)
    newData = newData.replace(/^FN;.*\nN;.*$/gm, function(match) {
        match = match.split("\n");
        return match[1] + "\n" + match[0];
    });
    return newData;
}

// Remove extra lines
// Use this to avoid unnecessary errors or weird cases
function removeExtraLines(vcard) {
    return vcard.replace(/\n\n/gm, "\n");
}

// Modify version info
function fixVersion(vcard) {
    return vcard.replaceAll("VERSION:3.0", "VERSION:2.1");
}

// LF to CRLF
// The phone won't accept the file in a format other than CRLF
function fixFormat(vcard) {
    return vcard.replace(/\n/g, "\r\n");
}

// Convert data function!
function ___PHONELINE__VCARD_3_0__TO_2_1___(vcard) {
    let newData = vcard;
    newData = fixCell(newData);
    newData = fixName(newData);
    newData = removeExtraLines(newData);
    newData = fixVersion(newData);
    newData = fixFormat(newData);
    return newData;
}



// NodeJS code:


const fs = require("fs"),
    path = require('path');

// Set up cmd interface!
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Get file content
function getFileContent(path) {
    // using the readFileSync() function
    // and passing the path to the file
    const buffer = fs.readFileSync(path);

    // use the toString() method to convert
    // Buffer into String
    return buffer.toString();
}

// Write file
function writeNFile(srcFilePath, content) {
    // Get folder path for source file
    let srcDir = path.dirname(srcFilePath).replaceAll("\\", "/");
    // Get name of source file
    let srcName = "PHONELINE-" + path.basename(srcFilePath);
    fs.writeFileSync(`${srcDir}/${srcName}`, content);
}

// Write split files
function writeSFiles(srcFilePath, content) {
    // Get folder path for source file
    let srcDir = path.dirname(srcFilePath).replaceAll("\\", "/");
    // Make folder for files!
    let newDir = `${srcDir}/PHONELINE-SPLIT`;
    fs.mkdirSync(newDir);
    // Write files
    let vcards = content.split("END:VCARD\n").filter(element => element)
        .map(function(e) {
            if (e[0] == "\n") {
                e = e.substring();
            }
            return e.replace(/^\n+|\n+$/gm, '') + "\nEND:VCARD\n";
        });;
    for (let i = 0; i < vcards.length; i++) {
        fs.writeFileSync(`${newDir}/${i}.vcf`, vcards[i]);
    }
}

// Ask user for file path
readline.question('Input 3.0 VCARD file path: ', (path) => {
    // Convert data
    let vcard = getFileContent(path);
    let newData = ___PHONELINE__VCARD_3_0__TO_2_1___(vcard);
    // Write data into new folder (split files)
    // writeSFiles(path, newData);
    // Write data into new file
    writeNFile(path, newData);
    // End!
    readline.close();
});