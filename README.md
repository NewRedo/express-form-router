# express-form-routing
Form life cycle scaffolding in express.

## Options
The following functions must be provided on an `options` object:
* `init`: Initialization middleware run on GET and POST.
* `validate`: Validation function run on POST.
* `process`: Processing middleware run on POST.
* `render`: Rendering middleware run on GET and POST.

## Example
```javascript
const formRouter = require("express-form-router");

app.use("/form", formRouter({
    init: (req, res, next) => {
        // Set up initial values.
        res.locals.values = {
            name: "John Smith",
            age: 18
        };
        next();
    },
    validate: (req, res, next) => {
        // Must call the express callback with (err, valid).
        if (req.body.name && req.body.age) {
            next(null, true);
        } else {
            next(null, false);
        }
    },
    process: (req, res, next) => {
        // Do something with the validated form data.
        var name = req.body.name;
        var age = req.body.age;
        console.log(`${name} is ${age} years old.`);
        res.redirect("/success");
    },
    render: (req, res, next) => {
        res.render("my-form");
    }
}));
```