/**
 * NoSQL to SQL Conversion Lib
 * **********************************************************************************************
 * 
 * DESCRIPTION:
 * Uses a MongoDB database and creates a m=new Mysql database replete with tables, columns and data
 * Mongo documents with differing keys on collections are handled gracefully
 * 
 * QUICKSTART HELP:
    - Log into the server at : 69.87.218.194 
    - log into mongodb:
    - useful mongo commands in this context: show databases; | use school; | show collections; | db.students.find();
    - In another terminal, tmux or screen session, log into mysql: mysql -u rchaube -p
    - useful mysql commands in this context: show databases; | use school; | show tables; | select * from students; | drop database school;
    - cd /root/rchaube/a2;
    - node app
    - Check to make sure database and tables are created in mysql
 * 
 * CREDITS:
 *  * Variety: https://github.com/variety/variety for details on schema analysis
 *  * Kudos to the paper and works in Scientific Programming - "Automatic NoSQL to Relational Database Transformation with Dynamic Schema Mapping"- Zain Aftab, Waheed Iqbal, Khaled Mohamad Almustafa, Faisal Bukhari, Muhammad Abdullah - https://www.hindawi.com/journals/sp/2020/8813350/ - extends and improves upon the work done at: https://github.com/database-conversion
 *  * https://stackoverflow.com/questions/2298870/get-names-of-all-keys-in-the-collection
 *  * Thanks to https://hevodata.com/blog/mongodb-to-mysql/
 * 
 *  TO DO : use dotenv here so that .env file can be excluded in .gitignore and credts don't go into repo
 * 
 * * * * * * * */

require('dotenv').config();


/**
 * Function: reconcileColumnsFromDocuments()
 * 
 * @param {mysql connection object} conn required 
 * @param  {Object} item required: A document from mongodb collection 
 * @param  {string} tablename required:  mysql table
 * @param {callback reference} callback required: function to run 
 *  
 * @returns {none}
 * 
 * Lists the columns in the supplied tablename by calling grokColumns, compares it to the keys in supplied item
 * Prepares an array of keys that exist in the supplied item but do not exist in the mysql tablename
 * Calls callback function by supplying the array of keys to add new columns in the mysql tablename one by one by   
 * and then inserts the data row corresponding to the supplied item
 *  
 */
function reconcileColumnsFromDocuments(conn, item, tablename, callback) {
	var MongoClient = require('mongodb').MongoClient,
	    format = require('util').format;
	var mysql = require("mysql");
	var i = 0;
	var which = new Array();
	var item_keys = Object.keys(item);
	conn.query('SHOW COLUMNS FROM ' + tablename, function(err, results) {
		grokColumns(results, function(fields) {
			// iterate the existing mysql columns for this table
			// index ind is incrementally assigned here
			fields.forEach(function(field, ind) {
				i = ind;
				// if the type and value of the item key does not match field, push into which array
				if (!(field === item_keys[ind])) {
					which.push(item_keys[ind]);
					// if our index ind matched the number of keys in the item, all columns have been pushed into the which array
					// so summon the callback function to create columns and then insert the data
					if (ind == item_keys.length - 1 && item_keys.length == fields.length - 1) {
						callback(which);
					} else if (i == fields.length - 1 && i < item_keys.length - 1) {
						// otherwise iterate the key in the item, puhs them into the which array
						// once done, summon the callback function to create columns and then insert the data
						item_keys.forEach(function(key, index) {
							if (index == i) {
								which.push(key);
								i++;
								if (i >= item_keys.length) {
									callback(which);
								}
							}
						});
					}
				}
				// If the numerical value of index ind is greater than or equals the number of columns in the tablename
				if (ind >= fields.length - 1) {
					// If the number of columns in the tablename matches the keys in the collection item
					// we can summon the callback function to create columns and then insert the data
					if (fields.length == item_keys.length) {
						console.log("Table " + tablename + ": " + which + " created");
						callback(which);
					} else {
						// number of columns in the tablename does not match the keys in the collection item
						// so iterate item keys, push to which array 
						// and then summon the callback function to create columns and then insert the data
						item_keys.forEach(function(key, index) {
							if (index == i + 1) {
								which.push(key);
								i++;
								if (i >= item_keys.length - 1) {
									callback(which);
								}
							}
						});
					}
				}
			});
		});
	});

}


/**
 * Function: morphMongoToMysqlSchema()
 * 
 * @param {callback reference} callback required: function to run 
 *  
 * @returns {none}
 * 
 * Creates the mysql database
 * Logs into mongo db, lists the collections in the database, pick first item in each collection lists the item and its keys in the collections 
 * Creates the mysql table for the collection, then calls callback function supplied as argument  
 * which in turn calls another callback populateTablesFromCollections to add the columns and rows 
 * from this item into the mysql table we just created 
 * 
 */
function morphMongoToMysqlSchema(callback) {
	
	var mysql = require("mysql");
	var con = mysql.createConnection({
		host : json["mysqlhost"],
		user : json["mysqluser"],
		password : json["mysqlpass"]
	});
	con.connect(function(err) {
		if (err) {
			console.log('Error connecting to the Mysql databaase');
			return;
		}
	});

	var tables = new Array();
	var collectionnames = new Array();
	var query = new Array();

	/*
	// drop db if it already exists for speedy development
	con.query("Drop Database IF EXISTS "+ json["mongodb"], function(err, rows, fields) {
		if (err) {
			console.log('Error dropping DB: ' + err);
			//throw err;return;
		}
		console.log("Existing database " + json["mongodb"] + " dropped");
	});
	*/

	//Create mysql database
	con.query('Create Database ' + json["mongodb"], function(err, rows, fields) {
		if (err) {
			console.log('Error creating Mysql database: ' + err);
			throw err;
			return;
		}
		console.log("Database " + json["mongodb"] + " created");
	});

	var MongoClient = require('mongodb').MongoClient,
	    format = require('util').format;
	MongoClient.connect('mongodb://' + json["mongohost"] + ':' + json["mongoport"] + '/' + json["mongodb"], function(err, db) {

		if (err)
			throw err;

		// Variety is an awesome github project we could use here to analyze our schema and get visibility into types and occurences
		// https://github.com/variety/variety
		// Let us keep it simple for this exercise and iterate the collections
		var coll = db.listCollections().toArray();
		db.listCollections().toArray(function(err, collections) {
			if (collections)
				collections.forEach(function(c, index) {
					var coll = db.collection(c["name"]);
					collectionnames.push(c["name"]);
					tables.push(json["mongodb"] + "." + c["name"]);

					coll.findOne(function(err, item) {
						if (err)
							throw err;
						var query1 = "";
						query1 = 'Create Table ' + json["mongodb"] + "." + c["name"] + " (";
						for (var key in Object.keys(item)) {
							if (key != 0)
								query1 = query1 + ",";

							query1 = query1 + " " + Object.keys(item)[key] + " text ";
						}
						query1 = query1 + ");";
						query.push(query1);
					});
				});
			else
				console.log(err);
			callback(query, tables, collectionnames);
		});

	});
}

/**
 * Function: grokColumns()
 * 
 * @param {mysql result object} results required: from query "SHOW COLUMNS FROM tablename" 
 * @param {callback reference} callback required: function to run 
 *  
 * @returns {none}
 * 
 * Iterates the columns, pushes the names into the fields array and calls the callback function by supplying the array fields
 * Called from function reconcileColumnsFromDocuments 
 */
function grokColumns(results, callback) {
	var fields = new Array();
	
	results.forEach(function(result, index) {
		fields.push(result["Field"]);
		if (index >= results.length - 1) {
			callback(fields);
		}
	});

}


/**
 * Function: morphMongoToMysqlSchema()
 * 
 * @param {mysql connection object} conn  required
 * @param {string} tablename  required
 * @param {string} collectionname  required
 * @param {callback reference} callback required: function to run 
 * 
 * @returns {none}
 * 
 * Connects to mongo database, grok handle to list of collections in the database
 * iterate the items in the collection, 
 * for each item, reconcile the columns by calling function with a callback to create the column for each new column 
 * in the item. Once the columns are reconciled, insert the row for this item into the relation
 * 
 */
function populateTablesFromCollections(conn, tablename, collectionname, callback) {
	var MongoClient = require('mongodb').MongoClient,
	    format = require('util').format;
	var mysql = require("mysql");

	MongoClient.connect('mongodb://' + json["mongohost"] + ':' + json["mongoport"] + '/' + json["mongodb"], function(err, db) {
		if (err)
			throw err;
		
		// grok handle to list of collections in the database
		var coll = db.collection(collectionname);
		// iterate the collections list, get a collection, convert the items in the collection to array
		coll.find().toArray(function(err, items) {
			// iterate the items in the collection
			items.forEach(function(item, index) {
				// for each item, reconcile the columns by calling function with a callback to create the column for each new column 
				// in the item
				reconcileColumnsFromDocuments(conn, item, tablename, function(which) {
					which.forEach(function(one, index) {
						var query = conn.query('ALTER TABLE ' + tablename + ' add column (' + one + ' text);', function(err, res) {
							if (err)
								console.log(err);
						});
					});
					// Once the columns are reconciled, insert the row for this item into the relation
					var q = conn.query('INSERT INTO ' + tablename + ' SET ?', item, function(err, result) {
						if (err) {
							console.log(err);
						} else {
							console.log("Student " + item.studentfirstname + " " + item.studentlastname + " inserted." );
						}
					});								
				});

			});
		});

	});

}


/**
 * Program call starts here
 * Define the connection creds for the mongo and mysql database 
 * (TO DO : use dotenv here so that .env file can be excluded in .gitignore and credts don't go into repo)
 * Then, call morphMongoToMysqlSchema and pass entire function as callback argument
 * */
var json = {
	"mongohost" : process.env.MONGOHOST,
	"mongoport" : process.env.MONGOPORT,
	"mongodb"   : process.env.MONGODB,
	"mongouser" : process.env.MONGOUSER,
	"mongopass" : process.env.MONGOPASS,
	"mysqlhost" : process.env.MYSQLHOST,
	"mysqluser" : process.env.MYSQLUSER,
	"mysqlpass" : process.env.MYSQLPASS
};


morphMongoToMysqlSchema(function(query, tables, collectionnames, callback) {
	var MongoClient = require('mongodb').MongoClient, 
	format = require('util').format;
	var mysql = require("mysql");

	connlcl = mysql.createConnection({
		host : json["mysqlhost"],
		user : json["mysqluser"],
		password : json["mysqlpass"],
	});

	connlcl.connect(function(err) {
		if (err) {
			console.log('Error connecting to Mysql Ddatabase: ' + err);
			return;
		}
		
		query.forEach(function(query1, index) {

			connlcl.query(query1, function(err, rows, fields) {
				if (err)
					throw err;
					populateTablesFromCollections(connlcl, tables[index], collectionnames[index], function(res) {
					console.log(res);
				});
			});
		});
		
	});
});