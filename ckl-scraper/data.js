var orm = require("orm");
var dbPosts = [];

module.exports = {
  getPosts: function () {
    orm.connect("mysql://root:ckl011001@cklabs.cogshfmhzdz4.sa-east-1.rds.amazonaws.com/cklab", function (err, db) {
	    db.driver.execQuery ( 
	      "SELECT * FROM posts ",
	        function (err, data) { 
            dbPosts = data;
          }
      )
    });
    return dbPosts;
  }
};
