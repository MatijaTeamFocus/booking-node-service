-- public.booking definition

CREATE TABLE public.booking (
	id serial4 NOT NULL,
	created_by_user_id int4 NOT NULL,
	start_date_time timestamptz NOT NULL,
	end_date_time timestamptz NOT NULL,
	parking_spot_id int4 NOT NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY (id)
);

-- public.parking_spot definition

CREATE TABLE public.parking_spot (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "PK_15bcb502057157741cff7a11ece" PRIMARY KEY (id)
);

-- public."user" definition

CREATE TYPE public."user_role_enum" AS ENUM (
	'Admin',
	'Standard');

CREATE TABLE public."user" (
	id serial4 NOT NULL,
	email varchar NOT NULL,
	"token" varchar NOT NULL,
	"role" public."user_role_enum" NOT NULL DEFAULT 'Standard'::user_role_enum,
	first_name varchar NOT NULL,
	last_name varchar NOT NULL,
	CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id)
);

-- public.booking foreign keys

ALTER TABLE public.booking ADD CONSTRAINT "FK_7547201d43f066d5dbf6d29eec0" FOREIGN KEY (parking_spot_id) REFERENCES public.parking_spot(id);
ALTER TABLE public.booking ADD CONSTRAINT "FK_fd140387142dbe12ab5f7d6be8e" FOREIGN KEY (created_by_user_id) REFERENCES public."user"(id);