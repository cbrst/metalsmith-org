var basename = require('path').basename;
var debug    = require('debug')('metalsmith-org');
var dirname  = require('path').dirname;
var extname  = require('path').extname;
var org      = require('org');

/**
 * Expose 'plugin'
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert org-mode files
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */

function plugin(options) {
    options = options || {
        headerOffset: 0,
        exportFromLineNumber: false,
        suppressSubScriptHandling: false,
        suppressAutoLink: false
    };
    var keys = options.keys || [];

    return function(files, metalsmith, done) {
        setImmediate(done);
        Object.keys(files).forEach(function(file) {
            debug('checking file: %s', file);
            if (!orgfile(file)) return;
            var data = files[file];
            var dir = dirname(file);
            var html = basename(file, extname(file)) + '.html';
            if ('.' != dir) html = dir + '/' + html;

            debug('converting file: %s', file);

            var str = orgparse(data.contents.toString(), options);

            data.contents = new Buffer(str);
            keys.forEach(function(key) {
                data[key] = orgparse(data[key], options);
            });

            delete files[file];
            files[html] = data;
        });
    };
}

/**
 * Convert org to HTML
 *
 * @param {String} orgCode
 * @param {Object} options
 * @return {String}
 */

function orgparse(orgCode, options) {
    var parser = new org.Parser();
    var html = parser.parse('\n Dummy title\n' + orgCode).convert(org.ConverterHTML, options);
    return html.contentHTML.toString();
}

/**
 * Check if a 'file' is org-mode.
 *
 * @param {String} file
 * @return {Boolean}
 */

function orgfile(file) {
    return /\.org/.test(extname(file));
}
