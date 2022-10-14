CREATE DATABASE shortly;

CREATE TABLE "public.ranking" (
	"id" serial NOT NULL,
	"linksCount" serial,
	"visitCount" serial,
	"idUser" integer NOT NULL,
	"idLink" integer NOT NULL,
	CONSTRAINT "ranking_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.users" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.links" (
	"id" serial NOT NULL,
	"url" TEXT NOT NULL,
	"short" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "links_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "ranking" ADD CONSTRAINT "ranking_fk0" FOREIGN KEY ("idUser") REFERENCES "users"("id");
ALTER TABLE "ranking" ADD CONSTRAINT "ranking_fk1" FOREIGN KEY ("idLink") REFERENCES "links"("id");






