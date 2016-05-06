var assert = require('assert');
var equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var ms_org = require('..');

describe('metalsmith-org', function() {
    it('should convert org-mode files', function(done) {
        Metalsmith('test/fixtures/basic')
            .use(ms_org())
            .build(function(err) {
                if (err) return done(err);
                equal('test/fixtures/basic/expected', 'test/fixtures/basic/build');
                done();
            });
    });

    it('should allow a "keys" option', function(done) {
        Metalsmith('test/fixtures/keys')
            .use(ms_org({
                keys: ['custom']
            }))
            .build(function(err, files) {
                if (err) return done(err);
                assert.equal('<p><span style="text-decoration:underline;">a</span></p>\n', files['index.html'].custom);
                done();
            });
    });
});
