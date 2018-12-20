/*
Copyright (c) 2018 NewRedo Ltd.

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

"use strict";

const assert = require("assert");

/*
    @param options Options for the system.
    @param options.init Initialisation middleware run on GET and POST.
    @param options.validate Validation function run on POST.
    @param options.process Processing middleware run on POST.
    @param options.render Rendering middleware run on GET and POST.
*/
module.exports = function(options) {
    assert(options);
    assert(options.init);
    assert(options.process);
    assert(options.render);

    const router = require("express").Router();

    // GET routing.
    router.get("/", options.init);
    router.get("/", options.render);

    // POST routing.
    router.post("/", options.init);
    router.post("/", (req, res, next) => {
        var validate = options.validate || ((req, res, next) => next(null, true));
        validate(req, res, function(err, valid) {
            if (err) {
                next(err);
            }
            else if (!valid) {
                next();
            }
            else {
                options.process(req, res, next);
            }
        });
    });
    router.post("/", options.render);

    return router;
}