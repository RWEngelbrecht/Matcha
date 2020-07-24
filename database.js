const mysql = require('mysql');
const { create } = require('./models/umod');

//connect first to see if db exists or not
const dbInit = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.DBUSER,
	password: process.env.PASSWD,
	port: process.env.DBPORT
});

dbInit.connect((err) => {
	if (err) throw err;
	console.log("Connected to SQL database...");
	dbInit.query("CREATE DATABASE IF NOT EXISTS matcha", (err, res) => {
		if (err) throw err;
		console.log("Database initialised...");
		dbInit.end();
	});
});

// // use connection pool to decrease overall latency when working with db
// const conPool = mysql.createPool({
// 	connectionLimit: 10,
// 	host: process.env.HOST,
// 	user: process.env.DBUSER,
// 	password: process.env.PASSWD,
// 	port: process.env.DBPORT,
// 	database: process.env.DB
// });

// conPool.getConnection((err, con) => {
// 	if (err) throw err;
// 	// how to handle interests, blocked, likes, views, chats?
// 	let query = `CREATE TABLE IF NOT EXISTS user(
// 		id INT AUTO_INCREMENT PRIMARY KEY,
// 		username VARCHAR(255) NOT NULL,
// 		password VARCHAR(255) NOT NULL,
// 		email VARCHAR(255) NOT NULL,
// 		firstname VARCHAR(255) NOT NULL,
// 		surname VARCHAR(255) NOT NULL,
// 		age VARCHAR(255) NOT NULL,
// 		gender VARCHAR(255) NOT NULL,
// 		genderpref VARCHAR(255) NOT NULL,
// 		photocount INT NOT NULL,
// 		fame INT NOT NULL,
// 		agepreflower INT NOT NULL,
// 		ageprefupper INT NOT NULL,
// 		about VARCHAR(255) NOT NULL,
// 		verifkey VARCHAR(255) NOT NULL,
// 		verified BOOLEAN DEFAULT 0,
// 		maxdist INT NOT NULL DEFAULT 50,
// 		interests VARCHAR(255) NOT NULL,
// 		lastSeen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 		loggedIn BOOLEAN DEFAULT 0,
// 		location VARCHAR(255) DEFAULT null,
// 		blocked VARCHAR(255) DEFAULT null,
// 		likedBy VARCHAR(255) DEFAULT null,
// 		viewedBy VARCHAR(255) DEFAULT null,
// 		notif INT DEFAULT 0,
// 		chatRooms VARCHAR(255) DEFAULT null
// 	)`;
// 	con.query(query, (err,rows) => {
// 		if (err) throw err;
// 		con.release();
// 	})
// });

// exports.executeQuery = function(query) {
// 	conPool.getConnection((err, con) => {
// 		if (err) throw err;
// 		con.query(query, (err, rows) => {
// 			if (err) throw err;
// 			con.release();
// 		});
// 	});
// }

// module.exports = conPool;

const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: process.env.HOST,
		user: process.env.DBUSER,
		password: process.env.PASSWD,
		port: process.env.DBPORT,
		database: process.env.DB
	},
	pool: { min: 0, max: 10 }
});
// move these to models as exported methods, require and call in createSchemas()
async function createSchemas() {
	if (!await knex.schema.hasTable('user')) {
		knex.schema.createTable('user', (table) => {
			table.increments('id').primary()
			table.string('username').notNullable()
			table.string('password').notNullable()
			table.string('email').notNullable()
			table.string('firstname').notNullable()
			table.string('surname').notNullable()
			table.integer('age').notNullable()
			table.string('gender').notNullable()
			table.string('genderpref').notNullable()
			table.integer('photocount').defaultTo(1)
			table.integer('fame').defaultTo(0)
			table.integer('agepreflower').notNullable()
			table.integer('ageprefupper').notNullable()
			table.string('about').notNullable()
			table.string('verifkey').notNullable()
			table.boolean('verified').defaultTo(false)
			table.integer('maxdist').defaultTo(50)
			table.specificType('lastSeen', 'BIGINT').defaultTo(Date.now())
			table.boolean('loggedIn').defaultTo(false)
		}).then(() => console.log('user table created'))
			.catch((err) => { throw err; })
			// .finally(() => { knex.destroy(); });
	}
	if (!await knex.schema.hasTable('photo')) {
		knex.schema.createTable('photo', (table) => {
			table.increments('id').primary()
			table.specificType('photo', 'LONGTEXT').notNullable()
			table.string('photoid').notNullable()
			table.integer('user_id').notNullable()
			table.boolean('isprofile').defaultTo(false)
		}).then(() => console.log('photo table created'))
			.catch((err) => { throw err; })
			// .finally(()=> { knex.destroy(); });
	}
	if (!await knex.schema.hasTable('interest')) {
		knex.schema.createTable('interest', (table) => {
			table.increments('id').primary()
			table.integer('user_id').notNullable()
			table.string('interest').defaultTo('')
		}).then(() => console.log('interest table created'))
			.catch((err) => { throw err; })
			// .finally(() => { knex.destroy(); });
	}
	if (!await knex.schema.hasTable('view')) {
		knex.schema.createTable('view', (table) => {
			table.increments('id').primary()
			table.integer('viewedUser').notNullable()
			table.integer('viewedBy').notNullable()
		}).then(() => console.log('view table created'))
			.catch((err) => { throw err; } )
			// .finally(() => { knex.destroy(); });
	}
	if (!await knex.schema.hasTable('location')) {
		knex.schema.createTable('location', (table) => {
			table.integer('user_id').primary()
			table.string('postal').notNullable()
			table.string('city').notNullable()
			table.string('region').notNullable()
		}).then(() => console.log('location table created'))
			.catch((err) => { throw err; })
			// .finally(() => { knex.destroy(); });
	}
	if (!await knex.schema.hasTable('like')) {
		knex.schema.createTable('like', (table) => {
			table.increments('id').primary()
			table.integer('likeBy').notNullable()
			table.integer('likedUser').notNullable()
			table.string('liker').nullable()
			table.string('liked').nullable()
			table.specificType('dateLiked', 'BIGINT').defaultTo(Date.now())
		}).then(() => console.log('like table created'))
			.catch((err) => { throw err; })
			// .finally(() => { knex.destroy(); });
	}
	if (!await knex.schema.hasTable('blocked')) {
		knex.schema.createTable('blocked', (table) => {
			table.increments('id').primary()
			table.integer('blockBy').notNullable()
			table.integer('blocked').notNullable();
		}).then(() => console.log('blocked table created'))
			.catch((err) => { throw err; })
			// .finally(() => { knex.destroy(); });
	}
}

createSchemas();

module.exports = knex;
