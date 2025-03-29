-- Create sequences first
CREATE SEQUENCE IF NOT EXISTS master_division_id_seq;
CREATE SEQUENCE IF NOT EXISTS master_employee_id_seq;
CREATE SEQUENCE IF NOT EXISTS master_menu_id_seq;
CREATE SEQUENCE IF NOT EXISTS master_permission_id_seq;
CREATE SEQUENCE IF NOT EXISTS master_product_id_seq;
CREATE SEQUENCE IF NOT EXISTS master_product_category_id_seq;
CREATE SEQUENCE IF NOT EXISTS master_region_id_seq;
CREATE SEQUENCE IF NOT EXISTS master_role_id_seq;
CREATE SEQUENCE IF NOT EXISTS master_user_menu_id_seq;
CREATE SEQUENCE IF NOT EXISTS master_zone_id_seq;
CREATE SEQUENCE IF NOT EXISTS role_menus_id_seq;
CREATE SEQUENCE IF NOT EXISTS role_permissions_id_seq;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: public.master_division

-- DROP TABLE IF EXISTS public.master_division;

CREATE TABLE IF NOT EXISTS public.master_division
(
    id integer NOT NULL DEFAULT nextval('master_division_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    tenant_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(50) COLLATE pg_catalog."default",
    updated_by character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT master_division_pkey PRIMARY KEY (id),
    CONSTRAINT master_division_tenant_id_fkey FOREIGN KEY (tenant_id)
        REFERENCES public.master_tenant (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_division
    OWNER to vomo_admin;

-- Set sequence owner
ALTER SEQUENCE master_division_id_seq OWNED BY master_division.id;

-- Create index for tenant_id
CREATE INDEX IF NOT EXISTS idx_division_tenant ON master_division(tenant_id);

-- Table: public.master_employee

-- DROP TABLE IF EXISTS public.master_employee;

CREATE TABLE IF NOT EXISTS public.master_employee
(
    id integer NOT NULL DEFAULT nextval('master_employee_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default",
    phone character varying(20) COLLATE pg_catalog."default",
    division_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT master_employee_pkey PRIMARY KEY (id),
    CONSTRAINT master_employee_email_key UNIQUE (email),
    CONSTRAINT master_employee_division_id_fkey FOREIGN KEY (division_id)
        REFERENCES public.master_division (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_employee
    OWNER to vomo_admin;

-- Table: public.master_menu

-- DROP TABLE IF EXISTS public.master_menu;

CREATE TABLE IF NOT EXISTS public.master_menu
(
    id integer NOT NULL DEFAULT nextval('master_menu_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    url character varying(255) COLLATE pg_catalog."default",
    icon character varying(50) COLLATE pg_catalog."default",
    parent_id integer,
    sort integer DEFAULT 0,
    tenant_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT master_menu_pkey PRIMARY KEY (id),
    CONSTRAINT master_menu_parent_id_fkey FOREIGN KEY (parent_id)
        REFERENCES public.master_menu (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT master_menu_tenant_id_fkey FOREIGN KEY (tenant_id)
        REFERENCES public.master_tenant (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_menu
    OWNER to vomo_admin;

-- Set sequence owner
ALTER SEQUENCE master_menu_id_seq OWNED BY public.master_menu.id;

-- Table: public.master_permission

-- DROP TABLE IF EXISTS public.master_permission;

CREATE TABLE IF NOT EXISTS public.master_permission
(
    id integer NOT NULL DEFAULT nextval('master_permission_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT master_permission_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_permission
    OWNER to vomo_admin;


-- Table: public.master_product

-- DROP TABLE IF EXISTS public.master_product;

CREATE TABLE IF NOT EXISTS public.master_product
(
    id integer NOT NULL DEFAULT nextval('master_product_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    code character varying(50) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    category_id integer,
    price numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT master_product_pkey PRIMARY KEY (id),
    CONSTRAINT master_product_code_key UNIQUE (code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_product
    OWNER to vomo_admin;

-- Table: public.master_product_category

-- DROP TABLE IF EXISTS public.master_product_category;

CREATE TABLE IF NOT EXISTS public.master_product_category
(
    id integer NOT NULL DEFAULT nextval('master_product_category_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT master_product_category_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_product_category
    OWNER to vomo_admin;

-- Table: public.master_region

-- DROP TABLE IF EXISTS public.master_region;

CREATE TABLE IF NOT EXISTS public.master_region
(
    id integer NOT NULL DEFAULT nextval('master_region_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT master_region_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_region
    OWNER to vomo_admin;

-- Table: public.master_role

-- DROP TABLE IF EXISTS public.master_role;

CREATE TABLE IF NOT EXISTS public.master_role
(
    id integer NOT NULL DEFAULT nextval('master_role_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT master_role_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_role
    OWNER to vomo_admin;

-- Table: public.master_user_menu

-- DROP TABLE IF EXISTS public.master_user_menu;

CREATE TABLE IF NOT EXISTS public.master_user_menu
(
    id integer NOT NULL DEFAULT nextval('master_user_menu_id_seq'::regclass),
    user_id integer NOT NULL,
    menu_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT master_user_menu_pkey PRIMARY KEY (id),
    CONSTRAINT master_user_menu_menu_id_fkey FOREIGN KEY (menu_id)
        REFERENCES public.master_menu (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_user_menu
    OWNER to vomo_admin;

-- Table: public.master_zone

-- DROP TABLE IF EXISTS public.master_zone;

CREATE TABLE IF NOT EXISTS public.master_zone
(
    id integer NOT NULL DEFAULT nextval('master_zone_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    region_id integer,
    description text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT master_zone_pkey PRIMARY KEY (id),
    CONSTRAINT master_zone_region_id_fkey FOREIGN KEY (region_id)
        REFERENCES public.master_region (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_zone
    OWNER to vomo_admin;

-- Create sequence for master_office
CREATE SEQUENCE IF NOT EXISTS master_office_id_seq;

-- Table: public.master_office

-- DROP TABLE IF EXISTS public.master_office;

CREATE TABLE IF NOT EXISTS public.master_office
(
    id integer NOT NULL DEFAULT nextval('master_office_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    code character varying(50) COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default",
    phone character varying(20) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    zone_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(50) COLLATE pg_catalog."default",
    updated_by character varying(50) COLLATE pg_catalog."default",
    tenant_id integer NOT NULL,
    CONSTRAINT master_office_pkey PRIMARY KEY (id),
    CONSTRAINT master_office_code_key UNIQUE (code),
    CONSTRAINT master_office_email_key UNIQUE (email),
    CONSTRAINT master_office_zone_id_fkey FOREIGN KEY (zone_id)
        REFERENCES public.master_zone (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT master_office_tenant_id_fkey FOREIGN KEY (tenant_id)
        REFERENCES public.master_tenant (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.master_office
    OWNER to vomo_admin;

-- Set sequence owner
ALTER SEQUENCE master_office_id_seq OWNED BY public.master_office.id;

-- Table: public.role_menus

-- DROP TABLE IF EXISTS public.role_menus;

CREATE TABLE IF NOT EXISTS public.role_menus
(
    id integer NOT NULL DEFAULT nextval('role_menus_id_seq'::regclass),
    role_id integer,
    menu_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT role_menus_pkey PRIMARY KEY (id),
    CONSTRAINT role_menus_role_id_menu_id_key UNIQUE (role_id, menu_id),
    CONSTRAINT role_menus_menu_id_fkey FOREIGN KEY (menu_id)
        REFERENCES public.master_menu (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT role_menus_role_id_fkey FOREIGN KEY (role_id)
        REFERENCES public.master_role (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.role_menus
    OWNER to vomo_admin;

-- Table: public.role_permissions

-- DROP TABLE IF EXISTS public.role_permissions;

CREATE TABLE IF NOT EXISTS public.role_permissions
(
    id integer NOT NULL DEFAULT nextval('role_permissions_id_seq'::regclass),
    role_id integer,
    permission_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT role_permissions_pkey PRIMARY KEY (id),
    CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id),
    CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id)
        REFERENCES public.master_permission (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id)
        REFERENCES public.master_role (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.role_permissions
    OWNER to vomo_admin;


-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to vomo_admin;