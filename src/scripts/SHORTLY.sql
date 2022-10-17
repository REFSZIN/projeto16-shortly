CREATE TABLE "ranking" (
	"id" serial NOT NULL,
	"linksCount" serial,
	"visitCount" serial,
	"idUser" integer NOT NULL,
	"idLink" integer NOT NULL,
	CONSTRAINT "ranking_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "links" (
	"id" serial NOT NULL,
	"url" TEXT NOT NULL,
	"short" varchar(50) NOT NULL UNIQUE,
	"userId" integer NOT NULL,
	CONSTRAINT "links_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "ranking" ADD CONSTRAINT "ranking_fk0" FOREIGN KEY ("idUser") REFERENCES "users"("id");
ALTER TABLE "ranking" ADD CONSTRAINT "ranking_fk1" FOREIGN KEY ("idLink") REFERENCES "links"("id");


ALTER TABLE "links" ADD CONSTRAINT "links_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");




