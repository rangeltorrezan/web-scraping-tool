var orm = require("orm");

orm.connect("mysql://root:ckl011001@cklabs.cogshfmhzdz4.sa-east-1.rds.amazonaws.com/cklab", function (err, db) {

    var Person = db.define("posts", {
        title : String,
        content: String,
        author: String,
        authorTwitter: String,
        authorProfile: String,
        datePublish: String,
    });


    db.drop(function () {
        // dropped all tables from defined models (Person and Pet)

        Person.sync(function () {
            // created tables for Person model
        });

    });
});