--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Debian 15.12-1.pgdg120+1)
-- Dumped by pg_dump version 15.12 (Debian 15.12-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.task_history DROP CONSTRAINT IF EXISTS task_history_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.task_history DROP CONSTRAINT IF EXISTS task_history_task_id_fkey;
ALTER TABLE IF EXISTS ONLY public.task_history DROP CONSTRAINT IF EXISTS task_history_employee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_menus DROP CONSTRAINT IF EXISTS role_menus_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_menus DROP CONSTRAINT IF EXISTS role_menus_menu_id_fkey;
ALTER TABLE IF EXISTS ONLY public.production_tasks DROP CONSTRAINT IF EXISTS production_tasks_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.production_tasks DROP CONSTRAINT IF EXISTS production_tasks_order_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.production_tasks DROP CONSTRAINT IF EXISTS production_tasks_employee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_office_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_zone DROP CONSTRAINT IF EXISTS master_zone_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_zone DROP CONSTRAINT IF EXISTS master_zone_region_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_user_menu DROP CONSTRAINT IF EXISTS master_user_menu_menu_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_role DROP CONSTRAINT IF EXISTS master_role_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_region DROP CONSTRAINT IF EXISTS master_region_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_product DROP CONSTRAINT IF EXISTS master_product_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_product_category DROP CONSTRAINT IF EXISTS master_product_category_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_product DROP CONSTRAINT IF EXISTS master_product_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_permission DROP CONSTRAINT IF EXISTS master_permission_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_office DROP CONSTRAINT IF EXISTS master_office_zone_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_office DROP CONSTRAINT IF EXISTS master_office_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_menu DROP CONSTRAINT IF EXISTS master_menu_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_menu DROP CONSTRAINT IF EXISTS master_menu_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_employee DROP CONSTRAINT IF EXISTS master_employee_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_employee DROP CONSTRAINT IF EXISTS master_employee_division_id_fkey;
ALTER TABLE IF EXISTS ONLY public.master_division DROP CONSTRAINT IF EXISTS master_division_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.backup DROP CONSTRAINT IF EXISTS backup_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_trail DROP CONSTRAINT IF EXISTS audit_trail_tenant_id_fkey;
DROP INDEX IF EXISTS public.idx_zone_tenant;
DROP INDEX IF EXISTS public.idx_users_tenant;
DROP INDEX IF EXISTS public.idx_task_history_tenant;
DROP INDEX IF EXISTS public.idx_task_history_task;
DROP INDEX IF EXISTS public.idx_task_history_employee;
DROP INDEX IF EXISTS public.idx_role_tenant;
DROP INDEX IF EXISTS public.idx_region_tenant;
DROP INDEX IF EXISTS public.idx_production_tasks_type;
DROP INDEX IF EXISTS public.idx_production_tasks_tenant;
DROP INDEX IF EXISTS public.idx_production_tasks_status;
DROP INDEX IF EXISTS public.idx_production_tasks_order_item;
DROP INDEX IF EXISTS public.idx_production_tasks_employee;
DROP INDEX IF EXISTS public.idx_product_tenant;
DROP INDEX IF EXISTS public.idx_product_status;
DROP INDEX IF EXISTS public.idx_product_images_tenant_id;
DROP INDEX IF EXISTS public.idx_product_images_product_id;
DROP INDEX IF EXISTS public.idx_product_code;
DROP INDEX IF EXISTS public.idx_product_category_tenant;
DROP INDEX IF EXISTS public.idx_product_category_code;
DROP INDEX IF EXISTS public.idx_product_category;
DROP INDEX IF EXISTS public.idx_permission_tenant;
DROP INDEX IF EXISTS public.idx_permission_code;
DROP INDEX IF EXISTS public.idx_payments_tenant;
DROP INDEX IF EXISTS public.idx_payments_status;
DROP INDEX IF EXISTS public.idx_payments_order;
DROP INDEX IF EXISTS public.idx_orders_tenant;
DROP INDEX IF EXISTS public.idx_orders_status;
DROP INDEX IF EXISTS public.idx_orders_payment_status;
DROP INDEX IF EXISTS public.idx_orders_number;
DROP INDEX IF EXISTS public.idx_orders_customer;
DROP INDEX IF EXISTS public.idx_order_items_tenant;
DROP INDEX IF EXISTS public.idx_order_items_status;
DROP INDEX IF EXISTS public.idx_order_items_product;
DROP INDEX IF EXISTS public.idx_order_items_order;
DROP INDEX IF EXISTS public.idx_order_items_current_task;
DROP INDEX IF EXISTS public.idx_menu_tenant;
DROP INDEX IF EXISTS public.idx_employee_tenant;
DROP INDEX IF EXISTS public.idx_division_tenant;
DROP INDEX IF EXISTS public.idx_backup_tenant;
DROP INDEX IF EXISTS public.idx_backup_created_at;
DROP INDEX IF EXISTS public.idx_audit_trail_tenant;
DROP INDEX IF EXISTS public.idx_audit_trail_entity;
DROP INDEX IF EXISTS public.idx_audit_trail_created_at;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.task_history DROP CONSTRAINT IF EXISTS task_history_pkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_permission_id_key;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.role_menus DROP CONSTRAINT IF EXISTS role_menus_role_id_menu_id_key;
ALTER TABLE IF EXISTS ONLY public.role_menus DROP CONSTRAINT IF EXISTS role_menus_pkey;
ALTER TABLE IF EXISTS ONLY public.production_tasks DROP CONSTRAINT IF EXISTS production_tasks_pkey;
ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS product_images_pkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_order_number_key;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.master_zone DROP CONSTRAINT IF EXISTS master_zone_pkey;
ALTER TABLE IF EXISTS ONLY public.master_user_menu DROP CONSTRAINT IF EXISTS master_user_menu_pkey;
ALTER TABLE IF EXISTS ONLY public.master_tenant DROP CONSTRAINT IF EXISTS master_tenant_pkey;
ALTER TABLE IF EXISTS ONLY public.master_tenant DROP CONSTRAINT IF EXISTS master_tenant_domain_key;
ALTER TABLE IF EXISTS ONLY public.master_role DROP CONSTRAINT IF EXISTS master_role_pkey;
ALTER TABLE IF EXISTS ONLY public.master_region DROP CONSTRAINT IF EXISTS master_region_pkey;
ALTER TABLE IF EXISTS ONLY public.master_product DROP CONSTRAINT IF EXISTS master_product_pkey;
ALTER TABLE IF EXISTS ONLY public.master_product DROP CONSTRAINT IF EXISTS master_product_code_key;
ALTER TABLE IF EXISTS ONLY public.master_product_category DROP CONSTRAINT IF EXISTS master_product_category_pkey;
ALTER TABLE IF EXISTS ONLY public.master_product_category DROP CONSTRAINT IF EXISTS master_product_category_code_key;
ALTER TABLE IF EXISTS ONLY public.master_permission DROP CONSTRAINT IF EXISTS master_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.master_permission DROP CONSTRAINT IF EXISTS master_permission_code_key;
ALTER TABLE IF EXISTS ONLY public.master_office DROP CONSTRAINT IF EXISTS master_office_pkey;
ALTER TABLE IF EXISTS ONLY public.master_office DROP CONSTRAINT IF EXISTS master_office_email_key;
ALTER TABLE IF EXISTS ONLY public.master_office DROP CONSTRAINT IF EXISTS master_office_code_key;
ALTER TABLE IF EXISTS ONLY public.master_menu DROP CONSTRAINT IF EXISTS master_menu_pkey;
ALTER TABLE IF EXISTS ONLY public.master_employee DROP CONSTRAINT IF EXISTS master_employee_pkey;
ALTER TABLE IF EXISTS ONLY public.master_employee DROP CONSTRAINT IF EXISTS master_employee_email_key;
ALTER TABLE IF EXISTS ONLY public.master_division DROP CONSTRAINT IF EXISTS master_division_pkey;
ALTER TABLE IF EXISTS ONLY public.backup DROP CONSTRAINT IF EXISTS backup_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_trail DROP CONSTRAINT IF EXISTS audit_trail_pkey;
ALTER TABLE IF EXISTS public.task_history ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.production_tasks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_images ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.master_tenant ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.master_office ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.master_menu ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.backup ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.audit_trail ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.task_history_id_seq;
DROP TABLE IF EXISTS public.task_history;
DROP TABLE IF EXISTS public.role_permissions;
DROP SEQUENCE IF EXISTS public.role_permissions_id_seq;
DROP TABLE IF EXISTS public.role_menus;
DROP SEQUENCE IF EXISTS public.role_menus_id_seq;
DROP SEQUENCE IF EXISTS public.production_tasks_id_seq;
DROP TABLE IF EXISTS public.production_tasks;
DROP SEQUENCE IF EXISTS public.product_images_id_seq;
DROP TABLE IF EXISTS public.product_images;
DROP SEQUENCE IF EXISTS public.payments_id_seq;
DROP TABLE IF EXISTS public.payments;
DROP SEQUENCE IF EXISTS public.orders_id_seq;
DROP TABLE IF EXISTS public.orders;
DROP SEQUENCE IF EXISTS public.order_items_id_seq;
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.master_zone;
DROP SEQUENCE IF EXISTS public.master_zone_id_seq;
DROP TABLE IF EXISTS public.master_user_menu;
DROP SEQUENCE IF EXISTS public.master_user_menu_id_seq;
DROP SEQUENCE IF EXISTS public.master_tenant_id_seq;
DROP TABLE IF EXISTS public.master_tenant;
DROP TABLE IF EXISTS public.master_role;
DROP SEQUENCE IF EXISTS public.master_role_id_seq;
DROP TABLE IF EXISTS public.master_region;
DROP SEQUENCE IF EXISTS public.master_region_id_seq;
DROP TABLE IF EXISTS public.master_product_category;
DROP SEQUENCE IF EXISTS public.master_product_category_id_seq;
DROP TABLE IF EXISTS public.master_product;
DROP SEQUENCE IF EXISTS public.master_product_id_seq;
DROP TABLE IF EXISTS public.master_permission;
DROP SEQUENCE IF EXISTS public.master_permission_id_seq;
DROP SEQUENCE IF EXISTS public.master_office_id_seq;
DROP TABLE IF EXISTS public.master_office;
DROP SEQUENCE IF EXISTS public.master_menu_id_seq;
DROP TABLE IF EXISTS public.master_menu;
DROP TABLE IF EXISTS public.master_employee;
DROP SEQUENCE IF EXISTS public.master_employee_id_seq;
DROP TABLE IF EXISTS public.master_division;
DROP SEQUENCE IF EXISTS public.master_division_id_seq;
DROP SEQUENCE IF EXISTS public.backup_id_seq;
DROP TABLE IF EXISTS public.backup;
DROP SEQUENCE IF EXISTS public.audit_trail_id_seq;
DROP TABLE IF EXISTS public.audit_trail;
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_trail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_trail (
    id integer NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id integer NOT NULL,
    action character varying(20) NOT NULL,
    old_values jsonb,
    new_values jsonb,
    tenant_id integer NOT NULL,
    created_by character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(255),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: audit_trail_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_trail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_trail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_trail_id_seq OWNED BY public.audit_trail.id;


--
-- Name: backup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup (
    id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    size bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    tenant_id integer NOT NULL,
    updated_at timestamp without time zone,
    updated_by character varying(255)
);


--
-- Name: backup_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.backup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: backup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.backup_id_seq OWNED BY public.backup.id;


--
-- Name: master_division_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_division_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_division; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_division (
    id integer DEFAULT nextval('public.master_division_id_seq'::regclass) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: master_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_employee_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_employee; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_employee (
    id integer DEFAULT nextval('public.master_employee_id_seq'::regclass) NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255),
    phone character varying(20),
    division_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: master_menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_menu (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    url character varying(255),
    icon character varying(50),
    parent_id integer,
    sort integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: master_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.master_menu_id_seq OWNED BY public.master_menu.id;


--
-- Name: master_office; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_office (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50),
    address text,
    phone character varying(20),
    email character varying(255),
    zone_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(50),
    updated_by character varying(50),
    tenant_id integer NOT NULL
);


--
-- Name: master_office_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_office_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_office_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.master_office_id_seq OWNED BY public.master_office.id;


--
-- Name: master_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_permission (
    id integer DEFAULT nextval('public.master_permission_id_seq'::regclass) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL,
    code character varying(100) NOT NULL,
    module character varying(100) NOT NULL
);


--
-- Name: master_product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_product (
    id integer DEFAULT nextval('public.master_product_id_seq'::regclass) NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50) NOT NULL,
    category_id integer NOT NULL,
    description text,
    material character varying(100),
    size_available jsonb,
    color_options jsonb,
    customization_options jsonb,
    production_time integer,
    min_order_quantity integer DEFAULT 1,
    base_price numeric(10,2) NOT NULL,
    bulk_discount_rules jsonb,
    weight numeric(5,2),
    is_active boolean DEFAULT true,
    stock_status character varying(50) DEFAULT 'in_stock'::character varying,
    tenant_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL,
    CONSTRAINT master_product_base_price_check CHECK ((base_price >= (0)::numeric)),
    CONSTRAINT master_product_min_order_check CHECK ((min_order_quantity > 0))
);


--
-- Name: master_product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_product_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_product_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_product_category (
    id integer DEFAULT nextval('public.master_product_category_id_seq'::regclass) NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    tenant_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: master_region_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_region_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_region; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_region (
    id integer DEFAULT nextval('public.master_region_id_seq'::regclass) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: master_role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_role (
    id integer DEFAULT nextval('public.master_role_id_seq'::regclass) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: master_tenant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_tenant (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    domain character varying(255) NOT NULL,
    status boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: master_tenant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_tenant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


--
-- Name: master_tenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.master_tenant_id_seq OWNED BY public.master_tenant.id;


--
-- Name: master_user_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_user_menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_user_menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_user_menu (
    id integer DEFAULT nextval('public.master_user_menu_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    menu_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: master_zone_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_zone_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_zone; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_zone (
    id integer DEFAULT nextval('public.master_zone_id_seq'::regclass) NOT NULL,
    name character varying(100) NOT NULL,
    region_id integer,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    size character varying(10) NOT NULL,
    color character varying(50) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    original_subtotal numeric(10,2) NOT NULL,
    applied_discount_rule jsonb,
    discount_amount numeric(10,2) DEFAULT 0,
    final_subtotal numeric(10,2) NOT NULL,
    customization jsonb DEFAULT '{}'::jsonb NOT NULL,
    current_task character varying(20) DEFAULT 'layout'::character varying NOT NULL,
    production_status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    tenant_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(255) NOT NULL,
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT valid_production_status CHECK (((production_status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    order_number character varying(50) NOT NULL,
    customer_name character varying(100) NOT NULL,
    customer_email character varying(255),
    customer_phone character varying(20),
    delivery_address text,
    office_id integer,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    discount_amount numeric(12,2) DEFAULT 0 NOT NULL,
    total_amount numeric(12,2) DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    payment_status character varying(20) DEFAULT 'unpaid'::character varying NOT NULL,
    expected_delivery_date date,
    notes text,
    tenant_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(255) NOT NULL,
    CONSTRAINT valid_order_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'in_production'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT valid_payment_status CHECK (((payment_status)::text = ANY ((ARRAY['unpaid'::character varying, 'partial'::character varying, 'paid'::character varying, 'refunded'::character varying])::text[])))
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_method character varying(50) NOT NULL,
    payment_date timestamp with time zone NOT NULL,
    reference_number character varying(100),
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    notes text,
    tenant_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(255) NOT NULL,
    CONSTRAINT valid_payment_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'refunded'::character varying])::text[])))
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer NOT NULL,
    image_url character varying(255) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(100) DEFAULT 'system'::character varying NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(100) DEFAULT 'system'::character varying NOT NULL,
    tenant_id integer NOT NULL
);


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: production_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.production_tasks (
    id bigint NOT NULL,
    order_item_id bigint NOT NULL,
    task_type character varying(20) NOT NULL,
    sequence_number integer NOT NULL,
    employee_id integer,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    notes text,
    tenant_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(255) NOT NULL,
    CONSTRAINT valid_task_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: production_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.production_tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: production_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.production_tasks_id_seq OWNED BY public.production_tasks.id;


--
-- Name: role_menus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.role_menus_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: role_menus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_menus (
    id integer DEFAULT nextval('public.role_menus_id_seq'::regclass) NOT NULL,
    role_id integer,
    menu_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.role_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id integer DEFAULT nextval('public.role_permissions_id_seq'::regclass) NOT NULL,
    role_id integer,
    permission_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: task_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_history (
    id bigint NOT NULL,
    task_id bigint NOT NULL,
    employee_id integer NOT NULL,
    status_change character varying(50),
    comment text,
    tenant_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(255) NOT NULL
);


--
-- Name: task_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.task_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: task_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.task_history_id_seq OWNED BY public.task_history.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL
);


--
-- Name: audit_trail id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_trail ALTER COLUMN id SET DEFAULT nextval('public.audit_trail_id_seq'::regclass);


--
-- Name: backup id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup ALTER COLUMN id SET DEFAULT nextval('public.backup_id_seq'::regclass);


--
-- Name: master_menu id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_menu ALTER COLUMN id SET DEFAULT nextval('public.master_menu_id_seq'::regclass);


--
-- Name: master_office id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_office ALTER COLUMN id SET DEFAULT nextval('public.master_office_id_seq'::regclass);


--
-- Name: master_tenant id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_tenant ALTER COLUMN id SET DEFAULT nextval('public.master_tenant_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: production_tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_tasks ALTER COLUMN id SET DEFAULT nextval('public.production_tasks_id_seq'::regclass);


--
-- Name: task_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_history ALTER COLUMN id SET DEFAULT nextval('public.task_history_id_seq'::regclass);


--
-- Data for Name: audit_trail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_trail (id, entity_type, entity_id, action, old_values, new_values, tenant_id, created_by, created_at, updated_by, updated_at) FROM stdin;
1	menu	38	update	{"id": 38, "url": "tes", "icon": "ni ni-cart", "name": "test test", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T07:56:47.420045Z", "created_by": "admin", "updated_at": "2025-03-23T15:00:53.807792Z", "updated_by": "admin"}	{"id": 38, "url": "tesasdsad", "icon": "ni ni-box-2", "name": "test test", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T07:56:47.420045Z", "created_by": "admin", "updated_at": "2025-03-23T15:03:51.4194733+07:00", "updated_by": "admin"}	1	admin	2025-03-23 15:03:51.428905	\N	2025-03-23 08:03:51.430351
2	menu	39	create	null	{"id": 39, "url": "", "icon": "ni ni-box-2", "name": "new data", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T08:05:18.129638Z", "created_by": "admin", "updated_at": "2025-03-23T08:05:18.129638Z", "updated_by": "admin"}	1	admin	2025-03-23 15:05:18.136336	\N	2025-03-23 08:05:18.138061
3	menu	38	update	{"id": 38, "url": "tesasdsad", "icon": "ni ni-box-2", "name": "test test", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T07:56:47.420045Z", "created_by": "admin", "updated_at": "2025-03-23T15:03:51.419473Z", "updated_by": "admin"}	{"id": 38, "url": "aaaa", "icon": "ni ni-box-2", "name": "test test", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T07:56:47.420045Z", "created_by": "admin", "updated_at": "2025-03-23T15:05:41.6232625+07:00", "updated_by": "admin"}	1	admin	2025-03-23 15:05:41.630317	\N	2025-03-23 08:05:41.630285
4	menu	39	delete	{"id": 39, "url": "", "icon": "ni ni-box-2", "name": "new data", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T08:05:18.129638Z", "created_by": "admin", "updated_at": "2025-03-23T08:05:18.129638Z", "updated_by": "admin"}	null	1	admin	2025-03-23 15:08:04.409984	\N	2025-03-23 08:08:04.411549
5	menu	38	delete	{"id": 38, "url": "aaaa", "icon": "ni ni-box-2", "name": "test test", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T07:56:47.420045Z", "created_by": "admin", "updated_at": "2025-03-23T15:05:41.623262Z", "updated_by": "admin"}	null	1	admin	2025-03-23 15:08:06.985538	\N	2025-03-23 08:08:06.98571
6	menu	40	create	null	{"id": 40, "url": "#", "icon": "ni ni-settings", "name": "System", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T08:08:29.163802Z", "created_by": "admin", "updated_at": "2025-03-23T08:08:29.163802Z", "updated_by": "admin"}	1	admin	2025-03-23 15:08:29.169159	\N	2025-03-23 08:08:29.170542
7	menu	40	update	{"id": 40, "url": "#", "icon": "ni ni-settings", "name": "System", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T08:08:29.163802Z", "created_by": "admin", "updated_at": "2025-03-23T08:08:29.163802Z", "updated_by": "admin"}	{"id": 40, "url": "", "icon": "ni ni-settings", "name": "System", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T08:08:29.163802Z", "created_by": "admin", "updated_at": "2025-03-23T15:08:51.7304139+07:00", "updated_by": "admin"}	1	admin	2025-03-23 15:08:51.735969	\N	2025-03-23 08:08:51.736737
8	menu	41	create	null	{"id": 41, "url": "/audit", "icon": "ni ni-archive-2", "name": "Audit Trail", "sort": 0, "parent_id": null, "tenant_id": 1, "created_at": "2025-03-23T08:11:39.560894Z", "created_by": "admin", "updated_at": "2025-03-23T08:11:39.560894Z", "updated_by": "admin"}	1	admin	2025-03-23 15:11:39.569003	\N	2025-03-23 08:11:39.569519
9	menu	41	update	{"id": 41, "url": "/audit", "icon": "ni ni-archive-2", "name": "Audit Trail", "sort": 1, "parent_id": 40, "tenant_id": 1, "created_at": "2025-03-23T08:11:39.560894Z", "created_by": "admin"}	{"id": 41, "url": "/audit", "icon": "ni ni-archive-2", "name": "Audit Trail test", "sort": 1, "parent_id": 40, "tenant_id": 1, "created_at": "2025-03-23T08:11:39.560894Z", "created_by": "admin"}	1	admin	2025-03-23 15:48:32.95183	\N	2025-03-23 08:48:32.953968
10	menu	41	update	{"id": 41, "url": "/audit", "icon": "ni ni-archive-2", "name": "Audit Trail test", "sort": 1, "parent_id": 40, "tenant_id": 1, "created_at": "2025-03-23T08:11:39.560894Z", "created_by": "admin"}	{"id": 41, "url": "/audit", "icon": "ni ni-archive-2", "name": "Audit Trail", "sort": 1, "parent_id": 40, "tenant_id": 1, "created_at": "2025-03-23T08:11:39.560894Z", "created_by": "admin"}	1	admin	2025-03-23 15:48:37.774268	\N	2025-03-23 08:48:37.774845
11	menu	41	update	{"id": 41, "url": "/audit", "icon": "ni ni-archive-2", "name": "Audit Trail", "sort": 1, "parent_id": 40, "tenant_id": 1, "created_at": "2025-03-23T08:11:39.560894Z", "created_by": "admin"}	{"id": 41, "url": "/audit", "icon": "ni ni-archive-2", "name": "Audit Trail test", "sort": 1, "parent_id": 40, "tenant_id": 1, "created_at": "2025-03-23T08:11:39.560894Z", "created_by": "admin"}	1	admin	2025-03-23 16:43:16.640861	\N	2025-03-23 09:43:16.641695
12	menu	41	update	{"id": 41, "url": "/audit", "icon": "ni ni-archive-2", "name": "Audit Trail test", "sort": 1, "parent_id": 40, "tenant_id": 1, "created_at": "2025-03-23T08:11:39.560894Z", "created_by": "admin"}	{"id": 41, "url": "/audit", "icon": "ni ni-archive-2", "name": "Audit Trail", "sort": 1, "parent_id": 40, "tenant_id": 1, "created_at": "2025-03-23T08:11:39.560894Z", "created_by": "admin"}	1	admin	2025-03-23 16:43:21.551152	\N	2025-03-23 09:43:21.551965
13	permission	41	create	\N	{"id": 41, "code": "", "name": "test", "module": "", "tenant_id": 1, "created_at": "2025-03-29T21:15:46.329394Z", "created_by": "admin", "updated_at": "2025-03-29T21:15:46.329394Z", "updated_by": "admin", "description": "test"}	1	admin	2025-03-29 14:15:46.32911	admin	2025-03-29 14:15:46.32911
14	permission	41	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 41, "name": "test", "tenant_id": 1, "created_at": "2025-03-29T21:15:46.329394Z", "created_by": "admin"}	1	admin	2025-03-29 21:15:46.358045	\N	2025-03-29 14:15:46.359341
15	permission	41	update	{"id": 41, "code": "", "name": "test", "module": "", "tenant_id": 1, "created_at": "2025-03-29T21:15:46.329394Z", "created_by": "admin", "updated_at": "2025-03-29T21:15:46.329394Z", "updated_by": "admin", "description": "test"}	{"id": 41, "code": "", "name": "test update", "module": "", "tenant_id": 1, "created_at": "2025-03-29T21:15:46.329394Z", "created_by": "admin", "updated_at": "2025-03-29T21:16:04.5183375+07:00", "updated_by": "admin", "description": "test"}	1	admin	2025-03-29 14:16:04.513848	admin	2025-03-29 14:16:04.513848
16	permission	41	update	{"id": 41, "name": "test", "tenant_id": 1, "created_at": "2025-03-29T21:15:46.329394Z", "created_by": "admin"}	{"id": 41, "name": "test update", "tenant_id": 1, "created_at": "2025-03-29T21:15:46.329394Z", "created_by": "admin"}	1	admin	2025-03-29 21:16:04.536005	\N	2025-03-29 14:16:04.536889
17	permission	41	delete	{"id": 41, "code": "", "name": "test update", "module": "", "tenant_id": 1, "created_at": "2025-03-29T21:15:46.329394Z", "created_by": "admin", "updated_at": "2025-03-29T21:16:04.518337Z", "updated_by": "admin", "description": "test"}	\N	1	admin	2025-03-29 14:16:08.317354	admin	2025-03-29 14:16:08.317354
18	permission	41	delete	{"id": 41, "name": "test update", "tenant_id": 1, "created_at": "2025-03-29T21:15:46.329394Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-03-29 21:16:08.331459	\N	2025-03-29 14:16:08.332486
19	product	3	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 3, "name": "Green Jersey", "tenant_id": 1, "created_at": "2025-03-30T06:25:43.264585Z", "created_by": "admin"}	1	admin	2025-03-30 13:25:43.329004	\N	2025-03-30 06:25:43.344205
20	product	4	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 4, "name": "Test new", "tenant_id": 1, "created_at": "2025-03-30T06:51:56.068678Z", "created_by": "admin"}	1	admin	2025-03-30 13:51:56.089695	\N	2025-03-30 06:51:56.091401
21	product	3	delete	{"id": 3, "name": "Green Jersey", "tenant_id": 1, "created_at": "2025-03-30T06:25:43.264585Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-03-30 13:55:23.159557	\N	2025-03-30 06:55:23.160587
22	product	5	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 5, "name": "test new", "tenant_id": 1, "created_at": "2025-03-30T07:33:11.579406Z", "created_by": "admin"}	1	admin	2025-03-30 14:33:11.591783	\N	2025-03-30 07:33:11.594204
23	product	5	delete	{"id": 5, "name": "test new", "tenant_id": 1, "created_at": "2025-03-30T07:33:11.579406Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-03-30 14:34:24.398619	\N	2025-03-30 07:34:24.39913
24	division	1	update	{"id": 1, "name": "ADMIN", "tenant_id": 1, "created_at": "2025-03-27T17:31:55.802818Z", "created_by": "system"}	{"id": 1, "name": "ADMIN", "tenant_id": 1, "created_at": "2025-03-27T17:31:55.802818Z", "created_by": "system"}	1	admin	2025-03-30 14:54:43.216178	\N	2025-03-30 07:54:43.217852
25	menu	43	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 43, "icon": "ni ni-tag", "name": "test", "tenant_id": 1, "created_at": "2025-03-30T08:11:00.466591Z", "created_by": "admin"}	1	admin	2025-03-30 15:11:00.477237	\N	2025-03-30 08:11:00.479408
26	menu	43	update	{"id": 43, "icon": "ni ni-tag", "name": "test", "tenant_id": 1, "created_at": "2025-03-30T08:11:00.466591Z", "created_by": "admin"}	{"id": 43, "icon": "ni ni-tag", "name": "test teasd", "tenant_id": 1, "created_at": "2025-03-30T08:11:00.466591Z", "created_by": "admin"}	1	admin	2025-03-30 15:11:26.343578	\N	2025-03-30 08:11:26.34421
27	menu	43	delete	{"id": 43, "icon": "ni ni-tag", "name": "test teasd", "tenant_id": 1, "created_at": "2025-03-30T08:11:00.466591Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-03-30 15:11:36.10173	\N	2025-03-30 08:11:36.102963
28	menu	44	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 44, "icon": "ni ni-tag", "name": "Menu Header", "tenant_id": 1, "created_at": "2025-03-30T15:43:03.595709Z", "created_by": "admin"}	1	admin	2025-03-30 22:43:03.649842	\N	2025-03-30 15:43:03.652545
29	menu	44	update	{"id": 44, "icon": "ni ni-tag", "name": "Menu Header", "tenant_id": 1, "created_at": "2025-03-30T15:43:03.595709Z", "created_by": "admin"}	{"id": 44, "icon": "ni ni-tag", "name": "Menu Header", "tenant_id": 1, "created_at": "2025-03-30T15:43:03.595709Z", "created_by": "admin"}	1	admin	2025-03-30 22:43:45.691317	\N	2025-03-30 15:43:45.693456
30	menu	45	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 45, "url": "/newmnu", "icon": "ni ni-money-coins", "name": "New menu", "parent_id": 44, "tenant_id": 1, "created_at": "2025-03-30T15:45:43.256613Z", "created_by": "admin"}	1	admin	2025-03-30 22:45:43.264754	\N	2025-03-30 15:45:43.265967
31	menu	45	delete	{"id": 45, "url": "/newmnu", "icon": "ni ni-money-coins", "name": "New menu", "parent_id": 44, "tenant_id": 1, "created_at": "2025-03-30T15:45:43.256613Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-03-30 22:45:52.783862	\N	2025-03-30 15:45:52.787302
32	menu	44	delete	{"id": 44, "icon": "ni ni-tag", "name": "Menu Header", "tenant_id": 1, "created_at": "2025-03-30T15:43:03.595709Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-03-30 22:45:55.410465	\N	2025-03-30 15:45:55.410605
33	employee	28	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	1	admin	2025-04-01 14:34:44.164123	\N	2025-04-01 07:34:44.165808
34	employee	29	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 29, "name": "asdads", "tenant_id": 1, "created_at": "2025-04-01T07:52:42.127171Z", "created_by": "admin"}	1	admin	2025-04-01 14:52:42.140858	\N	2025-04-01 07:52:42.141752
35	employee	30	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 30, "name": "finishing", "tenant_id": 1, "created_at": "2025-04-01T07:53:38.628777Z", "created_by": "admin"}	1	admin	2025-04-01 14:53:38.636532	\N	2025-04-01 07:53:38.636125
36	employee	28	update	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	1	admin	2025-04-01 14:57:26.824938	\N	2025-04-01 07:57:26.82643
37	employee	28	update	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	1	admin	2025-04-01 14:59:44.68783	\N	2025-04-01 07:59:44.688187
38	employee	28	update	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	1	admin	2025-04-01 15:01:11.799259	\N	2025-04-01 08:01:11.800063
39	employee	28	update	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	1	admin	2025-04-01 15:02:59.451081	\N	2025-04-01 08:02:59.453156
40	employee	30	delete	{"id": 30, "name": "finishing", "tenant_id": 1, "created_at": "2025-04-01T07:53:38.628777Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:04:47.208011	\N	2025-04-01 08:04:47.208981
41	employee	29	delete	{"id": 29, "name": "asdads", "tenant_id": 1, "created_at": "2025-04-01T07:52:42.127171Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:05:00.867764	\N	2025-04-01 08:05:00.869161
42	employee	31	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 31, "name": "john", "tenant_id": 1, "created_at": "2025-04-01T08:10:12.719458Z", "created_by": "admin"}	1	admin	2025-04-01 15:10:12.734173	\N	2025-04-01 08:10:12.734447
43	employee	31	update	{"id": 31, "name": "john", "tenant_id": 1, "created_at": "2025-04-01T08:10:12.719458Z", "created_by": "admin"}	{"id": 31, "name": "john update", "tenant_id": 1, "created_at": "2025-04-01T08:10:12.719458Z", "created_by": "admin"}	1	admin	2025-04-01 15:10:33.983903	\N	2025-04-01 08:10:33.983697
44	employee	31	delete	{"id": 31, "name": "john update", "tenant_id": 1, "created_at": "2025-04-01T08:10:12.719458Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:10:52.439594	\N	2025-04-01 08:10:52.440181
45	employee	28	delete	{"id": 28, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T07:34:44.1148Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:10:57.920398	\N	2025-04-01 08:10:57.921696
46	employee	32	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 32, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T08:16:10.495215Z", "created_by": "admin"}	1	admin	2025-04-01 15:16:10.501199	\N	2025-04-01 08:16:10.501663
47	employee	32	update	{"id": 32, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T08:16:10.495215Z", "created_by": "admin"}	{"id": 32, "name": "nurul hadi tset", "tenant_id": 1, "created_at": "2025-04-01T08:16:10.495215Z", "created_by": "admin"}	1	admin	2025-04-01 15:16:18.857479	\N	2025-04-01 08:16:18.858136
48	employee	32	delete	{"id": 32, "name": "nurul hadi tset", "tenant_id": 1, "created_at": "2025-04-01T08:16:10.495215Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:16:31.871848	\N	2025-04-01 08:16:31.871715
49	employee	33	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 33, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T08:18:40.302686Z", "created_by": "admin"}	1	admin	2025-04-01 15:18:40.321479	\N	2025-04-01 08:18:40.314338
50	employee	33	update	{"id": 33, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T08:18:40.302686Z", "created_by": "admin"}	{"id": 33, "name": "nurul hadi uody", "tenant_id": 1, "created_at": "2025-04-01T08:18:40.302686Z", "created_by": "admin"}	1	admin	2025-04-01 15:18:50.066209	\N	2025-04-01 08:18:50.068969
51	employee	33	delete	{"id": 33, "name": "nurul hadi uody", "tenant_id": 1, "created_at": "2025-04-01T08:18:40.302686Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:18:57.230342	\N	2025-04-01 08:18:57.233514
52	employee	34	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 34, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	1	admin	2025-04-01 15:19:52.86188	\N	2025-04-01 08:19:52.863733
53	employee	34	update	{"id": 34, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	{"id": 34, "name": "nurul hadi test", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	1	admin	2025-04-01 15:19:59.347363	\N	2025-04-01 08:19:59.350162
54	employee	34	update	{"id": 34, "name": "nurul hadi test", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	{"id": 34, "name": "nurul hadi test ASASD", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	1	admin	2025-04-01 15:20:14.661964	\N	2025-04-01 08:20:14.662973
55	employee	34	update	{"id": 34, "name": "nurul hadi test ASASD", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	{"id": 34, "name": "nurul hadi t", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	1	admin	2025-04-01 15:21:43.516767	\N	2025-04-01 08:21:43.51761
56	employee	34	update	{"id": 34, "name": "nurul hadi t", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	{"id": 34, "name": "nurul hadi tasasd", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	1	admin	2025-04-01 15:21:58.315962	\N	2025-04-01 08:21:58.318094
57	employee	35	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 35, "name": "asasd", "tenant_id": 1, "created_at": "2025-04-01T08:22:18.122244Z", "created_by": "admin"}	1	admin	2025-04-01 15:22:18.125982	\N	2025-04-01 08:22:18.126699
58	employee	35	update	{"id": 35, "name": "asasd", "tenant_id": 1, "created_at": "2025-04-01T08:22:18.122244Z", "created_by": "admin"}	{"id": 35, "name": "asasd asasd", "tenant_id": 1, "created_at": "2025-04-01T08:22:18.122244Z", "created_by": "admin"}	1	admin	2025-04-01 15:22:33.232818	\N	2025-04-01 08:22:33.232179
59	employee	35	delete	{"id": 35, "name": "asasd asasd", "tenant_id": 1, "created_at": "2025-04-01T08:22:18.122244Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:22:37.652628	\N	2025-04-01 08:22:37.652699
60	employee	34	delete	{"id": 34, "name": "nurul hadi tasasd", "tenant_id": 1, "created_at": "2025-04-01T08:19:52.858131Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:23:26.676599	\N	2025-04-01 08:23:26.678795
61	employee	36	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 36, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T08:25:18.765737Z", "created_by": "admin"}	1	admin	2025-04-01 15:25:18.770861	\N	2025-04-01 08:25:18.772091
62	employee	36	update	{"id": 36, "name": "nurul hadi", "tenant_id": 1, "created_at": "2025-04-01T08:25:18.765737Z", "created_by": "admin"}	{"id": 36, "name": "nurul hadi test", "tenant_id": 1, "created_at": "2025-04-01T08:25:18.765737Z", "created_by": "admin"}	1	admin	2025-04-01 15:25:24.368756	\N	2025-04-01 08:25:24.370866
63	employee	36	delete	{"id": 36, "name": "nurul hadi test", "tenant_id": 1, "created_at": "2025-04-01T08:25:18.765737Z", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:26:43.310041	\N	2025-04-01 08:26:43.311001
64	product_category	7	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 7, "name": "Test Category", "tenant_id": 1, "created_at": "2025-04-01T08:49:24.92839Z", "created_by": "admin"}	1	admin	2025-04-01 15:49:24.943235	\N	2025-04-01 08:49:24.945011
65	product_category	7	update	{"id": 7, "name": "Test Category", "tenant_id": 1, "created_at": "2025-04-01T08:49:24.92839Z", "created_by": "admin"}	{"id": 7, "name": "Test Category", "tenant_id": 1, "created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:49:43.552234	\N	2025-04-01 08:49:43.55369
66	product_category	7	delete	{"id": 7, "name": "Test Category", "tenant_id": 1, "created_at": "0001-01-01T00:00:00Z"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:50:01.511616	\N	2025-04-01 08:50:01.513618
67	product_category	8	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": 8, "name": "test", "tenant_id": 1, "created_at": "2025-04-01T08:50:24.530287Z", "created_by": "admin"}	1	admin	2025-04-01 15:50:24.53497	\N	2025-04-01 08:50:24.536412
68	product_category	8	update	{"id": 8, "name": "test", "tenant_id": 1, "created_at": "2025-04-01T08:50:24.530287Z", "created_by": "admin"}	{"id": 8, "name": "test test", "tenant_id": 1, "created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:50:29.256841	\N	2025-04-01 08:50:29.258362
69	product_category	8	update	{"id": 8, "name": "test test", "tenant_id": 1, "created_at": "0001-01-01T00:00:00Z"}	{"id": 8, "name": "test test", "tenant_id": 1, "created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:50:33.247317	\N	2025-04-01 08:50:33.249064
70	product_category	8	delete	{"id": 8, "name": "test test", "tenant_id": 1, "created_at": "0001-01-01T00:00:00Z"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 15:50:36.810221	\N	2025-04-01 08:50:36.811017
71	user	0	delete	{"id": "918ec695-573d-45c6-b408-e732a5b79bcf", "tenant_id": 1, "created_at": "2025-04-01T16:30:34.09158+07:00", "created_by": "admin"}	{"created_at": "0001-01-01T00:00:00Z"}	1	admin	2025-04-01 16:33:18.837229	\N	2025-04-01 09:33:18.83781
72	user	0	create	{"created_at": "0001-01-01T00:00:00Z"}	{"id": "a31debd8-ef47-4b2a-bb08-e7ca49fbbd88", "tenant_id": 1, "created_at": "2025-04-01T16:33:30.538388+07:00", "created_by": "admin"}	1	admin	2025-04-01 16:33:30.548839	\N	2025-04-01 09:33:30.549636
\.


--
-- Data for Name: backup; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup (id, file_name, size, created_at, created_by, tenant_id, updated_at, updated_by) FROM stdin;
3	db_backup_2025-03-27_00-14-48_a7363268.dump	50688	2025-03-27 00:14:49.453044	developer	1	\N	\N
4	db_backup_2025-03-27_01-42-03_9a8b67ae.dump	55488	2025-03-27 01:42:04.371803	developer	1	\N	\N
36	db_backup_2025-03-30_14-57-45_2521a6e4.dump	64238	2025-03-30 07:57:46.54205	developer	1	\N	developer
38	db_backup_2025-04-01_16-49-30_0c9ed976.dump	65964	2025-04-01 09:49:30.400806	developer	1	\N	developer
\.


--
-- Data for Name: master_division; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_division (id, name, description, created_at, updated_at, tenant_id, created_by, updated_by) FROM stdin;
9	FINISHING	Final finishing and quality check	2025-03-27 17:31:55.802818	2025-03-27 17:31:55.802818	1	system	system
8	SEWING	Sewing process	2025-03-27 17:31:55.802818	2025-03-27 17:31:55.802818	1	system	system
7	CUTTING	Cutting materials	2025-03-27 17:31:55.802818	2025-03-27 17:31:55.802818	1	system	system
6	PRESSING	Pressing materials	2025-03-27 17:31:55.802818	2025-03-27 17:31:55.802818	1	system	system
5	PREPARING	Preparing raw materials	2025-03-27 17:31:55.802818	2025-03-27 17:31:55.802818	1	system	system
4	PRINTING	Printing process division	2025-03-27 17:31:55.802818	2025-03-27 17:31:55.802818	1	system	system
3	LAYOUT	Layout and design department	2025-03-27 17:31:55.802818	2025-03-27 17:31:55.802818	1	system	system
2	SALES	Sales department	2025-03-27 17:31:55.802818	2025-03-27 17:31:55.802818	1	system	system
1	ADMIN	Administration department	2025-03-27 17:31:55.802818	2025-03-27 17:31:55.802818	1	system	system
\.


--
-- Data for Name: master_employee; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_employee (id, name, email, phone, division_id, created_at, updated_at, tenant_id, created_by, updated_by) FROM stdin;
4	David Williams	david.williams@email.com	123-456-7893	2	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
5	Emma Thompson	emma.thompson@email.com	123-456-7894	2	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
6	Frank Harris	frank.harris@email.com	123-456-7895	2	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
7	Grace Miller	grace.miller@email.com	123-456-7896	3	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
8	Henry Martinez	henry.martinez@email.com	123-456-7897	3	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
9	Isabella Garcia	isabella.garcia@email.com	123-456-7898	3	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
10	Jack Anderson	jack.anderson@email.com	123-456-7899	4	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
13	Mia Lopez	mia.lopez@email.com	123-456-7902	5	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
14	Noah Scott	noah.scott@email.com	123-456-7903	5	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
15	Olivia Adams	olivia.adams@email.com	123-456-7904	5	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
16	Paul Walker	paul.walker@email.com	123-456-7905	6	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
17	Quinn Carter	quinn.carter@email.com	123-456-7906	6	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
18	Rachel Evans	rachel.evans@email.com	123-456-7907	6	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
19	Samuel Turner	samuel.turner@email.com	123-456-7908	7	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
20	Tina Hall	tina.hall@email.com	123-456-7909	7	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
21	Umar Allen	umar.allen@email.com	123-456-7910	7	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
22	Victoria Hill	victoria.hill@email.com	123-456-7911	8	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
23	William Nelson	william.nelson@email.com	123-456-7912	8	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
24	Xander Wright	xander.wright@email.com	123-456-7913	8	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
25	Yasmine Baker	yasmine.baker@email.com	123-456-7914	9	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
26	Zachary Green	zachary.green@email.com	123-456-7915	9	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
27	Aaron Young	aaron.young@email.com	123-456-7916	9	2025-03-27 17:37:37.757119	2025-03-27 17:37:37.757119	1	system	system
11	Katherine White	katherine.white@email.com	123-456-7900	1	2025-03-27 17:37:37.757119	2025-03-30 14:54:43.207009	1	system	system
12	Liam Rodriguez	liam.rodriguez@email.com	123-456-7901	1	2025-03-27 17:37:37.757119	2025-03-30 14:54:43.207009	1	system	system
1	Alice Johnson	alice.johnson@email.com	123-456-7890	1	2025-03-27 17:37:37.757119	2025-03-30 14:54:43.207009	1	system	system
2	Bob Smith	bob.smith@email.com	123-456-7891	1	2025-03-27 17:37:37.757119	2025-03-30 14:54:43.207009	1	system	system
3	Charlie Brown	charlie.brown@email.com	123-456-7892	1	2025-03-27 17:37:37.757119	2025-03-30 14:54:43.207009	1	system	system
\.


--
-- Data for Name: master_menu; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_menu (id, name, url, icon, parent_id, sort, created_at, updated_at, tenant_id, created_by, updated_by) FROM stdin;
1	Access Management	\N	ni ni-settings	\N	1	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
2	Master Data	\N	ni ni-archive-2	\N	2	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
3	Transaction	\N	ni ni-cart	\N	3	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
4	Inventory	\N	ni ni-box-2	\N	4	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
5	Accounting	\N	ni ni-money-coins	\N	5	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
6	Permission	/permission	ni ni-key-25	1	1	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
7	Role	/role	ni ni-badge	1	2	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
8	User	/user	ni ni-single-02	1	3	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
9	Menu	/menu	ni ni-bullet-list-67	1	4	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
10	Zone	/zone	ni ni-map-big	2	1	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
11	Region	/region	ni ni-world-2	2	2	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
12	Office	/office	ni ni-building	2	3	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
13	Product	/product	ni ni-box-2	2	4	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
14	Product Category	/product-category	ni ni-tag	2	5	2025-03-22 08:00:31.935588	2025-03-22 08:00:31.935588	1	system	system
15	Employee	/employee	ni ni-circle-08	2	6	2025-03-22 08:00:31.935588	2025-03-22 08:00:31.935588	1	system	system
16	Division	/division	ni ni-collection	2	7	2025-03-22 08:00:31.935588	2025-03-22 08:00:31.935588	1	system	system
17	Order	/order	ni ni-cart	3	1	2025-03-22 08:00:31.935588	2025-03-22 08:00:31.935588	1	system	system
18	Order Detail	/order-detail	ni ni-bullet-list-67	3	2	2025-03-22 08:00:31.935588	2025-03-22 08:00:31.935588	1	system	system
19	Order Detail Item	/order-detail-item	ni ni-box-2	3	3	2025-03-22 08:00:31.935588	2025-03-22 08:00:31.935588	1	system	system
20	Payment	/payment	ni ni-money-coins	3	4	2025-03-22 08:00:31.935588	2025-03-22 08:00:31.935588	1	system	system
21	Payment Detail	/payment-detail	ni ni-bullet-list-67	3	5	2025-03-22 08:00:31.935588	2025-03-22 08:00:31.935588	1	system	system
22	Task	/task	ni ni-calendar-grid-58	3	6	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
23	Task History	/task-history	ni ni-time-alarm	3	7	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
24	Master Item	/master-item	ni ni-box-2	4	1	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
25	Stock Name	/stock-name	ni ni-tag	4	2	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
26	Master Supplier	/master-supplier	ni ni-delivery-fast	4	3	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
27	Cash Flow	/cash-flow	ni ni-money-coins	5	1	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
28	Purchase List	/purchase-list	ni ni-cart	5	2	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
29	Payment List	/payment-list	ni ni-credit-card	5	3	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
31	Petty Cash	/petty-cash	ni ni-money-coins	5	5	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
32	Transaction Category	/transaction-category	ni ni-tag	5	6	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
33	Petty Cash Request	/petty-cash-request	ni ni-paper-diploma	5	7	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
34	Petty Cash Summary	/petty-cash-summary	ni ni-chart-bar-32	5	8	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
30	SPK Data	/spk-data	ni ni-single-copy-04	5	4	2025-03-22 08:05:37.869698	2025-03-22 08:05:37.869698	1	system	system
40	System		ni ni-settings	\N	6	2025-03-23 08:08:29.163802	2025-03-23 15:08:51.730413	1	admin	admin
41	Audit Trail	/audit	ni ni-archive-2	40	1	2025-03-23 08:11:39.560894	2025-03-23 16:43:21.539038	1	admin	admin
42	Backup Management	/backup	ni ni-money-coins	40	2	2025-03-26 16:36:35.692878	2025-03-26 16:36:35.692878	1	system	system
\.


--
-- Data for Name: master_office; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_office (id, name, code, address, phone, email, zone_id, created_at, updated_at, created_by, updated_by, tenant_id) FROM stdin;
17	North City Main Office	NCMA001	123 North City Main St	+12345678901	north.city@office.com	1	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
18	North City Branch Office	NCBA001	456 North City Branch Ave	+12345678902	north.branch@office.com	1	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
19	North Rural Main Office	NRMA001	789 North Rural Main Rd	+12345678903	north.rural@office.com	2	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
20	North Rural Branch Office	NRBA001	321 North Rural Branch St	+12345678904	north.rural.branch@office.com	2	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
21	South City Main Office	SCMA001	123 South City Main St	+12345678905	south.city@office.com	3	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
22	South City Branch Office	SCBA001	456 South City Branch Ave	+12345678906	south.branch@office.com	3	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
23	South Rural Main Office	SRMA001	789 South Rural Main Rd	+12345678907	south.rural@office.com	4	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
24	South Rural Branch Office	SRBA001	321 South Rural Branch St	+12345678908	south.rural.branch@office.com	4	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
25	East City Main Office	ECMA001	123 East City Main St	+12345678909	east.city@office.com	5	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
26	East City Branch Office	ECBA001	456 East City Branch Ave	+12345678910	east.branch@office.com	5	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
27	East Rural Main Office	ERMA001	789 East Rural Main Rd	+12345678911	east.rural@office.com	6	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
28	East Rural Branch Office	ERBA001	321 East Rural Branch St	+12345678912	east.rural.branch@office.com	6	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
29	West City Main Office	WCMA001	123 West City Main St	+12345678913	west.city@office.com	7	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
30	West City Branch Office	WCBA001	456 West City Branch Ave	+12345678914	west.branch@office.com	7	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
31	West Rural Main Office	WRMA001	789 West Rural Main Rd	+12345678915	west.rural@office.com	8	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
32	West Rural Branch Office	WRBA001	321 West Rural Branch St	+12345678916	west.rural.branch@office.com	8	2025-03-26 18:05:30.945079	2025-03-26 18:05:30.945079	admin	admin	1
\.


--
-- Data for Name: master_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_permission (id, name, description, created_at, updated_at, tenant_id, created_by, updated_by, code, module) FROM stdin;
9	View Permissions	Can view permission list	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	PERMISSION_VIEW	ACCESS_MANAGEMENT
10	Manage Permissions	Can create/update permissions	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	PERMISSION_MANAGE	ACCESS_MANAGEMENT
11	View Roles	Can view role list	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ROLE_VIEW	ACCESS_MANAGEMENT
12	Manage Roles	Can create/update roles	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ROLE_MANAGE	ACCESS_MANAGEMENT
13	Delete Roles	Can delete roles	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ROLE_DELETE	ACCESS_MANAGEMENT
14	View Users	Can view user list	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	USER_VIEW	ACCESS_MANAGEMENT
15	Manage Users	Can create/update users	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	USER_MANAGE	ACCESS_MANAGEMENT
16	Delete Users	Can delete users	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	USER_DELETE	ACCESS_MANAGEMENT
17	View Menus	Can view menu list	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	MENU_VIEW	ACCESS_MANAGEMENT
18	Manage Menus	Can create/update menus	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	MENU_MANAGE	ACCESS_MANAGEMENT
19	View Zones	Can view zone list	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ZONE_VIEW	MASTER_DATA
20	Manage Zones	Can create/update zones	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ZONE_MANAGE	MASTER_DATA
21	Delete Zones	Can delete zones	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ZONE_DELETE	MASTER_DATA
22	View Orders	Can view order list	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ORDER_VIEW	TRANSACTION
23	Create Orders	Can create new orders	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ORDER_CREATE	TRANSACTION
24	Update Orders	Can update orders	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ORDER_UPDATE	TRANSACTION
25	Delete Orders	Can delete orders	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ORDER_DELETE	TRANSACTION
26	Approve Orders	Can approve orders	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	ORDER_APPROVE	TRANSACTION
27	View Payments	Can view payments	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	PAYMENT_VIEW	TRANSACTION
28	Process Payments	Can process payments	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	PAYMENT_PROCESS	TRANSACTION
29	Cancel Payments	Can cancel payments	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	PAYMENT_CANCEL	TRANSACTION
30	View Tasks	Can view tasks	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	TASK_VIEW	TRANSACTION
31	Manage Tasks	Can create/update tasks	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	TASK_MANAGE	TRANSACTION
32	Delete Tasks	Can delete tasks	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	TASK_DELETE	TRANSACTION
33	View Cash Flow	Can view cash flow	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	CASH_FLOW_VIEW	ACCOUNTING
34	Manage Cash Flow	Can manage cash flow	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	CASH_FLOW_MANAGE	ACCOUNTING
35	View Petty Cash	Can view petty cash	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	PETTY_CASH_VIEW	ACCOUNTING
36	Create Petty Cash	Can create petty cash	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	PETTY_CASH_CREATE	ACCOUNTING
37	Approve Petty Cash	Can approve petty cash	2025-03-23 17:29:56.267657	2025-03-23 17:29:56.267657	1	system	system	PETTY_CASH_APPROVE	ACCOUNTING
38	View Audit Trail	Can View Audit Trail	2025-03-23 17:51:14.619728	2025-03-23 17:51:14.619728	1	system	system	AUDIT_TRAIL_VIEW	SYSTEM
\.


--
-- Data for Name: master_product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_product (id, name, code, category_id, description, material, size_available, color_options, customization_options, production_time, min_order_quantity, base_price, bulk_discount_rules, weight, is_active, stock_status, tenant_id, created_at, updated_at, created_by, updated_by) FROM stdin;
1	Pro Soccer Jersey	PSJ001	1	Professional grade soccer jersey	Premium Polyester	["S", "M", "L", "XL", "XXL"]	["Red/White", "Blue/White", "Green/White", "Custom"]	{"name": true, "number": true, "patches": true, "team_logo": true}	5	1	49.99	{"10": 5, "20": 10, "50": 15}	180.00	t	in_stock	1	2025-03-28 15:20:47.844727	2025-03-28 15:20:47.844727	system	system
2	Basketball Pro Kit	BPK001	2	Professional basketball jersey kit	Mesh Polyester	["S", "M", "L", "XL", "XXL"]	["White/Black", "Black/Gold", "Red/Black", "Custom"]	{"name": true, "number": true, "team_logo": true}	7	5	59.99	{"10": 5, "20": 10, "50": 15}	200.00	t	in_stock	1	2025-03-28 15:20:47.844727	2025-03-28 15:20:47.844727	system	system
4	Test new	T01	2	tesasaads	test	["XS", "S", "M", "L", "XL", "XXL", "3XL"]	["Red/White", "Blue/White", "Green/White", "Black/White", "Custom"]	{"name": true, "number": true, "patches": true, "team_logo": true}	5	5	8.00	{"10": 5, "20": 2, "50": 10}	3.00	t	in_stock	1	2025-03-30 06:51:56.068678	2025-03-30 06:51:56.068678	admin	admin
\.


--
-- Data for Name: master_product_category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_product_category (id, name, code, description, is_active, tenant_id, created_at, updated_at, created_by, updated_by) FROM stdin;
1	Soccer Jersey	SOCCER	Soccer team jerseys and uniforms	t	1	2025-03-28 15:20:47.844727	2025-03-28 15:20:47.844727	system	system
2	Basketball Jersey	BBALL	Basketball team jerseys and uniforms	t	1	2025-03-28 15:20:47.844727	2025-03-28 15:20:47.844727	system	system
3	Baseball Jersey	BASEBALL	Baseball team jerseys and uniforms	t	1	2025-03-28 15:20:47.844727	2025-03-28 15:20:47.844727	system	system
4	Custom Team Jersey	CUSTOM	Custom designed team jerseys	t	1	2025-03-28 15:20:47.844727	2025-03-28 15:20:47.844727	system	system
5	Training Jersey	TRAINING	Training and practice jerseys	t	1	2025-03-28 15:20:47.844727	2025-03-28 15:20:47.844727	system	system
6	E-Sports Jersey	ESPORTS	E-Sports team jerseys and uniforms	t	1	2025-03-28 15:20:47.844727	2025-03-28 15:20:47.844727	system	system
\.


--
-- Data for Name: master_region; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_region (id, name, description, created_at, updated_at, tenant_id, created_by, updated_by) FROM stdin;
1	North Region	Northern region of the country	2025-03-26 18:03:22.834275	2025-03-26 18:03:22.834275	1	admin	admin
2	South Region	Southern region of the country	2025-03-26 18:03:22.834275	2025-03-26 18:03:22.834275	1	admin	admin
3	East Region	Eastern region of the country	2025-03-26 18:03:22.834275	2025-03-26 18:03:22.834275	1	admin	admin
4	West Region	Western region of the country	2025-03-26 18:03:22.834275	2025-03-26 18:03:22.834275	1	admin	admin
5	Central Region	Central region of the country	2025-03-26 18:03:22.834275	2025-03-26 18:03:22.834275	1	admin	admin
\.


--
-- Data for Name: master_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_role (id, name, description, created_at, updated_at, tenant_id, created_by, updated_by) FROM stdin;
1	Admin	System Administrator	2025-03-22 07:25:18.170058	2025-03-22 07:25:18.170058	1	system	system
2	Developer	Developer	2025-03-23 17:47:47.545982	2025-03-24 23:48:37.858856	1	system	admin
\.


--
-- Data for Name: master_tenant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_tenant (id, name, domain, status, created_at, updated_at, created_by, updated_by) FROM stdin;
1	Default Tenant	default.vomo.com	t	2025-03-22 07:46:30.347857	2025-03-22 07:46:30.347857	system	system
\.


--
-- Data for Name: master_user_menu; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_user_menu (id, user_id, menu_id, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: master_zone; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.master_zone (id, name, region_id, description, created_at, updated_at, tenant_id, created_by, updated_by) FROM stdin;
1	North Zone 1	1	First zone in North Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
2	North Zone 2	1	Second zone in North Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
3	South Zone 1	2	First zone in South Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
4	South Zone 2	2	Second zone in South Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
5	East Zone 1	3	First zone in East Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
6	East Zone 2	3	Second zone in East Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
7	West Zone 1	4	First zone in West Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
8	West Zone 2	4	Second zone in West Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
9	Central Zone 1	5	First zone in Central Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
10	Central Zone 2	5	Second zone in Central Region	2025-03-26 18:04:29.042981	2025-03-26 18:04:29.042981	1	admin	admin
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, size, color, unit_price, original_subtotal, applied_discount_rule, discount_amount, final_subtotal, customization, current_task, production_status, tenant_id, created_at, created_by, updated_at, updated_by) FROM stdin;
3	3	1	20	L	Red/White	49.99	999.80	{"quantity_threshold": 20, "discount_percentage": 10}	99.98	899.82	{"name": "FERNANDES", "number": "8", "patches": ["premier_league", "captain"], "team_logo": "manutd_logo.png", "special_instructions": "Captain armband print"}	printing	in_progress	1	2025-04-01 10:27:52.945804+00	system	2025-04-01 10:27:52.945804+00	system
4	3	1	15	M	Red/White	49.99	749.85	{"quantity_threshold": 10, "discount_percentage": 5}	37.49	712.36	{"name": "RASHFORD", "number": "10", "patches": ["premier_league"], "team_logo": "manutd_logo.png"}	cutting	in_progress	1	2025-04-01 10:27:52.945804+00	system	2025-04-01 10:27:52.945804+00	system
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, order_number, customer_name, customer_email, customer_phone, delivery_address, office_id, subtotal, discount_amount, total_amount, status, payment_status, expected_delivery_date, notes, tenant_id, created_at, created_by, updated_at, updated_by) FROM stdin;
3	ORD-2024-001	Manchester United FC	order@manutd.com	+44-123-456-7890	123 Sir Matt Busby Way, Manchester M16 0RA, UK	17	1749.65	137.47	1612.18	in_production	partial	2025-04-08	Team order for new season	1	2025-04-01 10:27:52.945804+00	system	2025-04-01 10:27:52.945804+00	system
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, order_id, amount, payment_method, payment_date, reference_number, status, notes, tenant_id, created_at, created_by, updated_at, updated_by) FROM stdin;
1	3	899.87	bank_transfer	2025-03-30 10:30:22.109029+00	TRX-2024-001-DP	completed	Initial 50% down payment	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
2	3	449.94	bank_transfer	2025-03-31 10:30:22.109029+00	TRX-2024-001-PP1	completed	Progress payment (25%)	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, image_url, sort_order, is_primary, created_at, created_by, updated_at, updated_by, tenant_id) FROM stdin;
6	1	/uploads/products/1743319424832942700_1.png	0	f	2025-03-30 07:23:44.836285+00	admin	2025-03-30 07:23:44.836285+00	admin	1
7	1	/uploads/products/1743319439386728500_1.png	0	f	2025-03-30 07:23:59.388736+00	admin	2025-03-30 07:23:59.388736+00	admin	1
8	2	/uploads/products/1743319783567784400_2.png	0	f	2025-03-30 07:29:43.570773+00	admin	2025-03-30 07:29:43.570773+00	admin	1
11	4	/uploads/products/1743320186461926700_4.png	0	f	2025-03-30 07:36:26.465237+00	admin	2025-03-30 07:36:26.465237+00	admin	1
12	4	/uploads/products/1743320453223313500_4.png	0	f	2025-03-30 07:40:53.225517+00	admin	2025-03-30 07:40:53.225517+00	admin	1
\.


--
-- Data for Name: production_tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.production_tasks (id, order_item_id, task_type, sequence_number, employee_id, status, started_at, completed_at, notes, tenant_id, created_at, created_by, updated_at, updated_by) FROM stdin;
1	3	layout	1	7	completed	2025-03-30 10:30:22.109029+00	2025-03-30 14:30:22.109029+00	Captain armband design approved	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
2	3	printing	2	10	in_progress	2025-03-30 15:30:22.109029+00	\N	Special attention to captain patch printing	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
3	3	cutting	3	19	pending	\N	\N	\N	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
4	3	sewing	4	22	pending	\N	\N	\N	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
5	3	pressing	5	16	pending	\N	\N	\N	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
6	3	finishing	6	25	pending	\N	\N	\N	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
7	3	quality_check	7	27	pending	\N	\N	\N	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
8	4	layout	1	7	completed	2025-03-30 10:30:22.109029+00	2025-03-30 12:30:22.109029+00	Standard jersey layout completed	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
9	4	printing	2	10	completed	2025-03-30 13:30:22.109029+00	2025-03-30 16:30:22.109029+00	Name and number printed successfully	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
10	4	cutting	3	19	in_progress	2025-03-30 17:30:22.109029+00	\N	Material preparation in progress	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
11	4	sewing	4	22	pending	\N	\N	\N	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
12	4	pressing	5	16	pending	\N	\N	\N	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
13	4	finishing	6	25	pending	\N	\N	\N	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
14	4	quality_check	7	27	pending	\N	\N	\N	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
\.


--
-- Data for Name: role_menus; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_menus (id, role_id, menu_id, created_at, created_by, updated_by) FROM stdin;
1	1	1	2025-03-22 07:25:18.170058	system	system
2	1	2	2025-03-22 07:25:18.170058	system	system
3	1	3	2025-03-22 07:25:18.170058	system	system
4	1	4	2025-03-22 07:25:18.170058	system	system
5	1	5	2025-03-22 07:25:18.170058	system	system
6	1	6	2025-03-22 07:25:18.170058	system	system
7	1	7	2025-03-22 07:25:18.170058	system	system
8	1	8	2025-03-22 07:25:18.170058	system	system
9	1	9	2025-03-22 07:25:18.170058	system	system
10	1	10	2025-03-22 07:25:18.170058	system	system
11	1	11	2025-03-22 07:25:18.170058	system	system
12	1	12	2025-03-22 07:25:18.170058	system	system
13	1	13	2025-03-22 07:25:18.170058	system	system
27	1	14	2025-03-22 08:01:33.579056	system	system
28	1	15	2025-03-22 08:01:33.579056	system	system
29	1	16	2025-03-22 08:01:33.579056	system	system
30	1	17	2025-03-22 08:01:33.579056	system	system
33	1	20	2025-03-22 08:01:33.579056	system	system
56	1	22	2025-03-22 08:05:53.211416	system	system
58	1	24	2025-03-22 08:05:53.211416	system	system
59	1	25	2025-03-22 08:05:53.211416	system	system
60	1	26	2025-03-22 08:05:53.211416	system	system
61	1	27	2025-03-22 08:05:53.211416	system	system
62	1	28	2025-03-22 08:05:53.211416	system	system
63	1	29	2025-03-22 08:05:53.211416	system	system
64	1	30	2025-03-22 08:05:53.211416	system	system
65	1	31	2025-03-22 08:05:53.211416	system	system
66	1	32	2025-03-22 08:05:53.211416	system	system
67	1	33	2025-03-22 08:05:53.211416	system	system
68	1	34	2025-03-22 08:05:53.211416	system	system
71	2	41	2025-03-23 08:13:03.43411	system	system
72	2	40	2025-03-23 08:14:14.063347	system	system
73	2	42	2025-03-26 16:37:41.986296	system	system
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions (id, role_id, permission_id, created_at, created_by, updated_by, updated_at) FROM stdin;
5	1	9	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
6	1	10	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
7	1	11	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
8	1	12	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
9	1	13	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
10	1	14	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
11	1	15	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
12	1	16	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
13	1	17	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
14	1	18	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
15	1	19	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
16	1	20	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
17	1	21	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
18	1	22	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
19	1	23	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
20	1	24	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
21	1	25	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
22	1	26	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
23	1	27	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
24	1	28	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
25	1	29	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
26	1	30	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
27	1	31	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
28	1	32	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
29	1	33	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
30	1	34	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
31	1	35	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
32	1	36	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
33	1	37	2025-03-23 17:49:34.448035	system	system	2025-03-23 17:49:34.448035
43	2	38	2025-03-24 23:48:37.872075	admin	admin	2025-03-24 23:48:37.872075
44	2	17	2025-03-24 23:48:37.87498	admin	admin	2025-03-24 23:48:37.87498
\.


--
-- Data for Name: task_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.task_history (id, task_id, employee_id, status_change, comment, tenant_id, created_at, created_by, updated_at, updated_by) FROM stdin;
1	1	7	pending->in_progress	Starting layout for captain jersey	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
2	1	7	in_progress->completed	Layout completed and approved by supervisor	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
3	2	10	pending->in_progress	Beginning printing process for captain jersey	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
4	8	7	pending->in_progress	Starting layout for standard jersey	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
5	8	7	in_progress->completed	Layout completed - standard template	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
6	9	10	pending->in_progress	Starting printing process	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
7	9	10	in_progress->completed	Printing completed successfully	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
8	10	19	pending->in_progress	Beginning cutting process	1	2025-04-01 10:30:22.109029+00	system	2025-04-01 10:30:22.109029+00	system
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, password, role_id, created_at, updated_at, tenant_id, created_by, updated_by) FROM stdin;
2edc5fea-66b5-42b3-b43e-c62cffce2827	admin	admin@vomo.com	$2a$10$l3Z707FqsWjwr5/eu6ZhJOs2khyvl/nvPGxGqvHkaMC0GAZiD/0SC	1	2025-03-22 07:46:34.636008+00	2025-03-22 07:46:34.636008+00	1	system	system
4578c1ad-3f61-40a4-b50d-edd103c0998a	developer	developer@vomo.com	$2a$10$l3Z707FqsWjwr5/eu6ZhJOs2khyvl/nvPGxGqvHkaMC0GAZiD/0SC	2	2025-03-23 17:54:53.830827+00	2025-03-23 17:54:53.830827+00	1	system	system
a31debd8-ef47-4b2a-bb08-e7ca49fbbd88	admin2	admin2@vomo.com	$2a$10$rStpWqylI8QAFMYU2cdrVu85iwKXaMgwSrXv0M9iqECKEUgiE4zLW	1	2025-04-01 09:33:30.538388+00	2025-04-01 09:33:30.538388+00	1	admin	admin
\.


--
-- Name: audit_trail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_trail_id_seq', 72, true);


--
-- Name: backup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.backup_id_seq', 38, true);


--
-- Name: master_division_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_division_id_seq', 1, false);


--
-- Name: master_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_employee_id_seq', 36, true);


--
-- Name: master_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_menu_id_seq', 45, true);


--
-- Name: master_office_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_office_id_seq', 32, true);


--
-- Name: master_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_permission_id_seq', 41, true);


--
-- Name: master_product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_product_category_id_seq', 8, true);


--
-- Name: master_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_product_id_seq', 5, true);


--
-- Name: master_region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_region_id_seq', 15, true);


--
-- Name: master_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_role_id_seq', 7, true);


--
-- Name: master_tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_tenant_id_seq', 1, true);


--
-- Name: master_user_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_user_menu_id_seq', 1, false);


--
-- Name: master_zone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.master_zone_id_seq', 36, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 4, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 3, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 2, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 12, true);


--
-- Name: production_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.production_tasks_id_seq', 14, true);


--
-- Name: role_menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.role_menus_id_seq', 73, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 70, true);


--
-- Name: task_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.task_history_id_seq', 8, true);


--
-- Name: audit_trail audit_trail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_trail
    ADD CONSTRAINT audit_trail_pkey PRIMARY KEY (id);


--
-- Name: backup backup_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup
    ADD CONSTRAINT backup_pkey PRIMARY KEY (id);


--
-- Name: master_division master_division_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_division
    ADD CONSTRAINT master_division_pkey PRIMARY KEY (id);


--
-- Name: master_employee master_employee_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_employee
    ADD CONSTRAINT master_employee_email_key UNIQUE (email);


--
-- Name: master_employee master_employee_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_employee
    ADD CONSTRAINT master_employee_pkey PRIMARY KEY (id);


--
-- Name: master_menu master_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_menu
    ADD CONSTRAINT master_menu_pkey PRIMARY KEY (id);


--
-- Name: master_office master_office_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_office
    ADD CONSTRAINT master_office_code_key UNIQUE (code);


--
-- Name: master_office master_office_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_office
    ADD CONSTRAINT master_office_email_key UNIQUE (email);


--
-- Name: master_office master_office_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_office
    ADD CONSTRAINT master_office_pkey PRIMARY KEY (id);


--
-- Name: master_permission master_permission_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_permission
    ADD CONSTRAINT master_permission_code_key UNIQUE (code);


--
-- Name: master_permission master_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_permission
    ADD CONSTRAINT master_permission_pkey PRIMARY KEY (id);


--
-- Name: master_product_category master_product_category_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_product_category
    ADD CONSTRAINT master_product_category_code_key UNIQUE (code, tenant_id);


--
-- Name: master_product_category master_product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_product_category
    ADD CONSTRAINT master_product_category_pkey PRIMARY KEY (id);


--
-- Name: master_product master_product_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_product
    ADD CONSTRAINT master_product_code_key UNIQUE (code, tenant_id);


--
-- Name: master_product master_product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_product
    ADD CONSTRAINT master_product_pkey PRIMARY KEY (id);


--
-- Name: master_region master_region_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_region
    ADD CONSTRAINT master_region_pkey PRIMARY KEY (id);


--
-- Name: master_role master_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_role
    ADD CONSTRAINT master_role_pkey PRIMARY KEY (id);


--
-- Name: master_tenant master_tenant_domain_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_tenant
    ADD CONSTRAINT master_tenant_domain_key UNIQUE (domain);


--
-- Name: master_tenant master_tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_tenant
    ADD CONSTRAINT master_tenant_pkey PRIMARY KEY (id);


--
-- Name: master_user_menu master_user_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_user_menu
    ADD CONSTRAINT master_user_menu_pkey PRIMARY KEY (id);


--
-- Name: master_zone master_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_zone
    ADD CONSTRAINT master_zone_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: production_tasks production_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_tasks
    ADD CONSTRAINT production_tasks_pkey PRIMARY KEY (id);


--
-- Name: role_menus role_menus_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_menus
    ADD CONSTRAINT role_menus_pkey PRIMARY KEY (id);


--
-- Name: role_menus role_menus_role_id_menu_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_menus
    ADD CONSTRAINT role_menus_role_id_menu_id_key UNIQUE (role_id, menu_id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: task_history task_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_trail_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_trail_created_at ON public.audit_trail USING btree (created_at);


--
-- Name: idx_audit_trail_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_trail_entity ON public.audit_trail USING btree (entity_type, entity_id);


--
-- Name: idx_audit_trail_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_trail_tenant ON public.audit_trail USING btree (tenant_id);


--
-- Name: idx_backup_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_backup_created_at ON public.backup USING btree (created_at);


--
-- Name: idx_backup_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_backup_tenant ON public.backup USING btree (tenant_id);


--
-- Name: idx_division_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_division_tenant ON public.master_division USING btree (tenant_id);


--
-- Name: idx_employee_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_employee_tenant ON public.master_employee USING btree (tenant_id);


--
-- Name: idx_menu_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_menu_tenant ON public.master_menu USING btree (tenant_id);


--
-- Name: idx_order_items_current_task; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_current_task ON public.order_items USING btree (current_task);


--
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- Name: idx_order_items_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_product ON public.order_items USING btree (product_id);


--
-- Name: idx_order_items_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_status ON public.order_items USING btree (production_status);


--
-- Name: idx_order_items_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_tenant ON public.order_items USING btree (tenant_id);


--
-- Name: idx_orders_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_name, customer_email);


--
-- Name: idx_orders_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_number ON public.orders USING btree (order_number);


--
-- Name: idx_orders_payment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_payment_status ON public.orders USING btree (payment_status);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_orders_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_tenant ON public.orders USING btree (tenant_id);


--
-- Name: idx_payments_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payments_order ON public.payments USING btree (order_id);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- Name: idx_payments_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payments_tenant ON public.payments USING btree (tenant_id);


--
-- Name: idx_permission_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_code ON public.master_permission USING btree (code);


--
-- Name: idx_permission_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_tenant ON public.master_permission USING btree (tenant_id);


--
-- Name: idx_product_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_category ON public.master_product USING btree (category_id);


--
-- Name: idx_product_category_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_category_code ON public.master_product_category USING btree (code);


--
-- Name: idx_product_category_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_category_tenant ON public.master_product_category USING btree (tenant_id);


--
-- Name: idx_product_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_code ON public.master_product USING btree (code);


--
-- Name: idx_product_images_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_product_id ON public.product_images USING btree (product_id);


--
-- Name: idx_product_images_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_tenant_id ON public.product_images USING btree (tenant_id);


--
-- Name: idx_product_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_status ON public.master_product USING btree (stock_status);


--
-- Name: idx_product_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_tenant ON public.master_product USING btree (tenant_id);


--
-- Name: idx_production_tasks_employee; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_tasks_employee ON public.production_tasks USING btree (employee_id);


--
-- Name: idx_production_tasks_order_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_tasks_order_item ON public.production_tasks USING btree (order_item_id);


--
-- Name: idx_production_tasks_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_tasks_status ON public.production_tasks USING btree (status);


--
-- Name: idx_production_tasks_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_tasks_tenant ON public.production_tasks USING btree (tenant_id);


--
-- Name: idx_production_tasks_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_tasks_type ON public.production_tasks USING btree (task_type);


--
-- Name: idx_region_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_region_tenant ON public.master_region USING btree (tenant_id);


--
-- Name: idx_role_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_tenant ON public.master_role USING btree (tenant_id);


--
-- Name: idx_task_history_employee; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_task_history_employee ON public.task_history USING btree (employee_id);


--
-- Name: idx_task_history_task; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_task_history_task ON public.task_history USING btree (task_id);


--
-- Name: idx_task_history_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_task_history_tenant ON public.task_history USING btree (tenant_id);


--
-- Name: idx_users_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_tenant ON public.users USING btree (tenant_id);


--
-- Name: idx_zone_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_zone_tenant ON public.master_zone USING btree (tenant_id);


--
-- Name: audit_trail audit_trail_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_trail
    ADD CONSTRAINT audit_trail_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: backup backup_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup
    ADD CONSTRAINT backup_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_division master_division_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_division
    ADD CONSTRAINT master_division_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_employee master_employee_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_employee
    ADD CONSTRAINT master_employee_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.master_division(id);


--
-- Name: master_employee master_employee_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_employee
    ADD CONSTRAINT master_employee_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_menu master_menu_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_menu
    ADD CONSTRAINT master_menu_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.master_menu(id);


--
-- Name: master_menu master_menu_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_menu
    ADD CONSTRAINT master_menu_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_office master_office_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_office
    ADD CONSTRAINT master_office_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_office master_office_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_office
    ADD CONSTRAINT master_office_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.master_zone(id);


--
-- Name: master_permission master_permission_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_permission
    ADD CONSTRAINT master_permission_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_product master_product_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_product
    ADD CONSTRAINT master_product_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.master_product_category(id);


--
-- Name: master_product_category master_product_category_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_product_category
    ADD CONSTRAINT master_product_category_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_product master_product_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_product
    ADD CONSTRAINT master_product_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_region master_region_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_region
    ADD CONSTRAINT master_region_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_role master_role_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_role
    ADD CONSTRAINT master_role_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: master_user_menu master_user_menu_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_user_menu
    ADD CONSTRAINT master_user_menu_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.master_menu(id);


--
-- Name: master_zone master_zone_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_zone
    ADD CONSTRAINT master_zone_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.master_region(id);


--
-- Name: master_zone master_zone_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_zone
    ADD CONSTRAINT master_zone_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.master_product(id);


--
-- Name: order_items order_items_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: orders orders_office_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_office_id_fkey FOREIGN KEY (office_id) REFERENCES public.master_office(id);


--
-- Name: orders orders_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: payments payments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.master_product(id) ON DELETE CASCADE;


--
-- Name: production_tasks production_tasks_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_tasks
    ADD CONSTRAINT production_tasks_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.master_employee(id);


--
-- Name: production_tasks production_tasks_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_tasks
    ADD CONSTRAINT production_tasks_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE CASCADE;


--
-- Name: production_tasks production_tasks_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_tasks
    ADD CONSTRAINT production_tasks_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: role_menus role_menus_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_menus
    ADD CONSTRAINT role_menus_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.master_menu(id);


--
-- Name: role_menus role_menus_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_menus
    ADD CONSTRAINT role_menus_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.master_role(id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.master_permission(id);


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.master_role(id);


--
-- Name: task_history task_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.master_employee(id);


--
-- Name: task_history task_history_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.production_tasks(id) ON DELETE CASCADE;


--
-- Name: task_history task_history_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- Name: users users_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.master_tenant(id);


--
-- PostgreSQL database dump complete
--

