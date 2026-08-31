BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "UserMedia" (
	"user_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"path"	TEXT NOT NULL,
	"date_added"	TEXT NOT NULL,
	"ext"	TEXT NOT NULL,
	"og_name"	TEXT NOT NULL,
	"mimetype"	TEXT NOT NULL,
	"file_size"	INTEGER NOT NULL,
	PRIMARY KEY("user_id","og_name")
);
CREATE TABLE IF NOT EXISTS "User" (
	"id"	INTEGER,
	"email"	TEXT NOT NULL UNIQUE,
	"first_name"	TEXT NOT NULL,
	"last_name"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"max_storage"	NUMERIC NOT NULL,
	"max_file_size"	INTEGER NOT NULL,
	"account_status"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
