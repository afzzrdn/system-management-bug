--
-- PostgreSQL database dump
--

\restrict u1DZvR9gr525nVoxAvvClVHFXZRLaycSbhgwVg1egvRJD0FMk0cFpm4eYs46WFx

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attachments; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.attachments (
    id uuid NOT NULL,
    bug_id uuid NOT NULL,
    uploaded_by uuid NOT NULL,
    file_path character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    file_name character varying(255),
    mime character varying(255),
    size bigint
);


ALTER TABLE public.attachments OWNER TO laravel;

--
-- Name: bugs; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.bugs (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    priority character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    project_id uuid NOT NULL,
    reported_by uuid NOT NULL,
    assigned_to uuid,
    resolved_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    type character varying(255) DEFAULT 'Lainnya'::character varying NOT NULL,
    schedule_start_at timestamp(0) with time zone,
    due_at timestamp(0) with time zone,
    delay_reason text,
    overdue_notified_at timestamp(0) with time zone,
    CONSTRAINT bugs_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[]))),
    CONSTRAINT bugs_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'resolved'::character varying])::text[])))
);


ALTER TABLE public.bugs OWNER TO laravel;

--
-- Name: cache; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache OWNER TO laravel;

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO laravel;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.chat_messages (
    id uuid NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    message text NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.chat_messages OWNER TO laravel;

--
-- Name: inbound_messages; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.inbound_messages (
    id uuid NOT NULL,
    phone character varying(255) NOT NULL,
    message text NOT NULL,
    device_id character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.inbound_messages OWNER TO laravel;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO laravel;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: laravel
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO laravel;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: laravel
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    message text,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.notifications OWNER TO laravel;

--
-- Name: password_reset_otps; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.password_reset_otps (
    id bigint NOT NULL,
    identifier character varying(255) NOT NULL,
    otp character varying(6) NOT NULL,
    token character varying(255) NOT NULL,
    is_used boolean DEFAULT false NOT NULL,
    expires_at timestamp(0) without time zone NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_otps OWNER TO laravel;

--
-- Name: password_reset_otps_id_seq; Type: SEQUENCE; Schema: public; Owner: laravel
--

CREATE SEQUENCE public.password_reset_otps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.password_reset_otps_id_seq OWNER TO laravel;

--
-- Name: password_reset_otps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: laravel
--

ALTER SEQUENCE public.password_reset_otps_id_seq OWNED BY public.password_reset_otps.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.projects (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    client_id uuid NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.projects OWNER TO laravel;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id uuid,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO laravel;

--
-- Name: users; Type: TABLE; Schema: public; Owner: laravel
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'client'::character varying NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    phone character varying(255),
    asal character varying(255)
);


ALTER TABLE public.users OWNER TO laravel;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: password_reset_otps id; Type: DEFAULT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.password_reset_otps ALTER COLUMN id SET DEFAULT nextval('public.password_reset_otps_id_seq'::regclass);


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.attachments (id, bug_id, uploaded_by, file_path, created_at, updated_at, file_name, mime, size) FROM stdin;
\.


--
-- Data for Name: bugs; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.bugs (id, title, description, priority, status, project_id, reported_by, assigned_to, resolved_at, created_at, updated_at, type, schedule_start_at, due_at, delay_reason, overdue_notified_at) FROM stdin;
541935b0-3642-4bec-a5cf-8c4b89408c6c	Filter data tidak mengembalikan hasil yang benar (Website E-Commerce)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Website E-Commerce. Mohon segera ditindaklanjuti oleh tim developer.	high	in_progress	b2f0edf4-602c-4ad8-b49e-055017df614a	3c72459d-f919-4fb0-8ac4-325d34b28968	c544e93e-e022-4ddc-969c-09c5914020c6	\N	2025-10-01 08:42:09	2025-10-01 08:42:09	Fitur	2025-10-01 11:42:09+00	2025-10-06 11:42:09+00	\N	\N
d8d0b7fa-7f1f-4d43-bbed-c13cc7ac8f2b	Error login pada halaman utama (Website E-Commerce)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Website E-Commerce. Mohon segera ditindaklanjuti oleh tim developer.	critical	resolved	b2f0edf4-602c-4ad8-b49e-055017df614a	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-10-23 12:42:09	2025-10-23 12:42:09	Fitur	\N	2025-10-30 12:42:09+00	\N	\N
630815c9-396e-4982-bf36-9a3d5a75f418	Tampilan dashboard tidak responsive (Website E-Commerce)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Website E-Commerce. Mohon segera ditindaklanjuti oleh tim developer.	critical	resolved	b2f0edf4-602c-4ad8-b49e-055017df614a	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-10-16 06:42:09	2025-10-16 06:42:09	Keamanan	\N	2025-10-29 06:42:09+00	\N	\N
77fb3378-050a-41e6-a075-89392fea9f7e	API timeout ketika request data project (Mobile App Bug Tracker)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Mobile App Bug Tracker. Mohon segera ditindaklanjuti oleh tim developer.	critical	resolved	7529d507-c7ed-4818-b1b3-08d29e9edbe6	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-10-11 11:42:09	2025-10-11 11:42:09	Tampilan	\N	2025-10-23 11:42:09+00	\N	\N
cd514eb2-5e27-4d22-ad65-b44bbdd0d0a1	Error login pada halaman utama (Mobile App Bug Tracker)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Mobile App Bug Tracker. Mohon segera ditindaklanjuti oleh tim developer.	high	open	7529d507-c7ed-4818-b1b3-08d29e9edbe6	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-10-16 09:42:09	2025-10-16 09:42:09	Fitur	\N	2025-10-25 09:42:09+00	\N	\N
0fe959fc-88ab-4cf3-9ba9-e8dc6cb5ac53	Tombol simpan tidak berfungsi di form edit (Mobile App Bug Tracker)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Mobile App Bug Tracker. Mohon segera ditindaklanjuti oleh tim developer.	low	open	7529d507-c7ed-4818-b1b3-08d29e9edbe6	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-10-09 00:42:09	2025-10-09 00:42:09	Error	\N	2025-10-19 00:42:09+00	\N	\N
d663bd5f-b341-4c66-b89c-716069f7866e	Tampilan dashboard tidak responsive (Company Profile Website)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Company Profile Website. Mohon segera ditindaklanjuti oleh tim developer.	medium	open	143f7a5b-a863-414e-bf54-4c0142aeb2eb	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-10-14 12:42:09	2025-10-14 12:42:09	Fitur	\N	2025-10-29 12:42:09+00	\N	\N
66e84aff-f58f-4d41-9f70-b7785ee0c0d7	Error login pada halaman utama (Company Profile Website)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Company Profile Website. Mohon segera ditindaklanjuti oleh tim developer.	critical	resolved	143f7a5b-a863-414e-bf54-4c0142aeb2eb	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-10-11 01:42:09	2025-10-11 01:42:09	Lainnya	\N	2025-10-23 01:42:09+00	\N	\N
b9535c43-58ec-4e55-9e4b-7dcce0272a2e	Tampilan dashboard tidak responsive (Company Profile Website)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Company Profile Website. Mohon segera ditindaklanjuti oleh tim developer.	critical	resolved	143f7a5b-a863-414e-bf54-4c0142aeb2eb	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-09-29 11:42:09	2025-09-29 11:42:09	Fitur	\N	2025-10-05 11:42:09+00	\N	\N
606ec225-1da2-4f8b-8d98-882c8049e77d	Tampilan dashboard tidak responsive (Company Profile Website)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Company Profile Website. Mohon segera ditindaklanjuti oleh tim developer.	critical	open	143f7a5b-a863-414e-bf54-4c0142aeb2eb	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-10-10 12:42:09	2025-10-10 12:42:09	Tampilan	\N	2025-10-16 12:42:09+00	\N	\N
6b7398e4-dd69-4555-872f-3f4720061822	Tampilan dashboard tidak responsive (Company Profile Website)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Company Profile Website. Mohon segera ditindaklanjuti oleh tim developer.	medium	open	143f7a5b-a863-414e-bf54-4c0142aeb2eb	3c72459d-f919-4fb0-8ac4-325d34b28968	\N	\N	2025-10-13 15:42:09	2025-10-13 15:42:09	Error	\N	2025-10-18 15:42:09+00	\N	\N
7d9e472d-c0c9-46cd-981a-7332f13d02fc	Error login pada halaman utama (Website E-Commerce)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Website E-Commerce. Mohon segera ditindaklanjuti oleh tim developer.	critical	resolved	b2f0edf4-602c-4ad8-b49e-055017df614a	3c72459d-f919-4fb0-8ac4-325d34b28968	21e1bf5e-4b21-4dbc-b80f-1b0025e28c46	2025-10-25 14:10:40	2025-10-13 12:42:09	2025-10-25 14:10:40	Lainnya	2025-10-13 14:42:09+00	2025-10-16 14:42:09+00	\N	\N
8709c879-c7bb-4113-a556-d9d0b278857a	Tombol simpan tidak berfungsi di form edit (Website E-Commerce)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Website E-Commerce. Mohon segera ditindaklanjuti oleh tim developer.	high	resolved	b2f0edf4-602c-4ad8-b49e-055017df614a	3c72459d-f919-4fb0-8ac4-325d34b28968	21e1bf5e-4b21-4dbc-b80f-1b0025e28c46	2025-10-25 14:10:46	2025-10-16 11:42:09	2025-10-25 14:10:46	Lainnya	2025-10-16 16:42:09+00	2025-10-22 16:42:09+00	\N	\N
9252ee67-d722-4e31-ae79-183a8b05eb0f	Perhitungan total harga tidak sesuai (Mobile App Bug Tracker)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Mobile App Bug Tracker. Mohon segera ditindaklanjuti oleh tim developer.	critical	in_progress	7529d507-c7ed-4818-b1b3-08d29e9edbe6	3c72459d-f919-4fb0-8ac4-325d34b28968	21e1bf5e-4b21-4dbc-b80f-1b0025e28c46	2025-10-25 14:10:42	2025-09-29 08:42:09	2025-10-28 00:03:13	Tampilan	2025-09-29 14:42:09+00	2025-10-04 14:42:09+00	\N	\N
aba298e9-4206-4503-8991-5e8753906550	Error login pada halaman utama (Mobile App Bug Tracker)	Ini adalah deskripsi detail untuk bug yang dilaporkan pada project Mobile App Bug Tracker. Mohon segera ditindaklanjuti oleh tim developer.	medium	open	7529d507-c7ed-4818-b1b3-08d29e9edbe6	3c72459d-f919-4fb0-8ac4-325d34b28968	21e1bf5e-4b21-4dbc-b80f-1b0025e28c46	2025-10-25 14:10:44	2025-10-24 15:42:09	2025-10-28 00:03:15	Keamanan	2025-10-24 20:42:09+00	2025-11-02 20:42:09+00	\N	\N
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.cache (key, value, expiration) FROM stdin;
laravel_cache_user-is-online-3b4c2fc5-028d-45d1-9ae4-b6c2465a6ff2	b:1;	1761584152
laravel_cache_user-is-online-850372fe-ca8c-4793-8914-c24fdb037f1f	b:1;	1761376224
laravel_cache_user-is-online-21e1bf5e-4b21-4dbc-b80f-1b0025e28c46	b:1;	1761585757
laravel_cache_user-is-online-3c72459d-f919-4fb0-8ac4-325d34b28968	b:1;	1761591319
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.chat_messages (id, sender_id, receiver_id, message, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inbound_messages; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.inbound_messages (id, phone, message, device_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	2025_07_15_045224_create_users_table	1
2	2025_07_16_022435_create_sessions_table	1
3	2025_07_18_022853_create_projects_table	1
4	2025_07_21_070243_create_bugs_table	1
5	2025_07_22_080722_create_notifications_table	1
6	2025_07_28_025849_create_attachment_table	1
7	2025_08_04_100857_create_chat_messages_table	1
8	2025_08_05_065028_create_cache_table	1
9	2025_08_05_072347_add_phone_to_users_table	1
10	2025_08_05_131221_create_inbound_messages_table	1
11	2025_08_12_070832_add_skill_and_type_bug_table.	1
12	2025_08_15_000001_add_schedule_to_bugs_table	1
13	2025_08_20_000001_add_meta_to_attachments_table	1
14	2025_09_19_075249_add_asal_to_users_table	1
15	2025_09_19_075333_add_asal_to_users_table	1
16	2025_09_19_080434_create_password_reset_otps_table	1
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.notifications (id, user_id, title, message, is_read, created_at, updated_at) FROM stdin;
983e40b4-7b2b-4390-90c2-8b8418960f19	3c72459d-f919-4fb0-8ac4-325d34b28968	Bug Telah Selesai	Bug "Tombol simpan tidak berfungsi di form edit (Website E-Commerce)" pada project Website E-Commerce telah diselesaikan.	t	2025-10-25 14:10:46	2025-10-25 14:12:23
e3ff00a5-b1e6-4555-9d0c-a61c029ea647	3c72459d-f919-4fb0-8ac4-325d34b28968	Bug Selesai Sesuai Jadwal	Bug "Error login pada halaman utama (Mobile App Bug Tracker)" pada project Mobile App Bug Tracker telah diselesaikan tepat waktu.	t	2025-10-25 14:10:44	2025-10-25 14:12:26
117ec061-05e0-4331-a6d8-f0b5fb2f8cff	3c72459d-f919-4fb0-8ac4-325d34b28968	Bug Telah Selesai	Bug "Perhitungan total harga tidak sesuai (Mobile App Bug Tracker)" pada project Mobile App Bug Tracker telah diselesaikan.	t	2025-10-25 14:10:42	2025-10-25 14:12:29
f14d2898-9df9-470f-894e-85399292dacb	3c72459d-f919-4fb0-8ac4-325d34b28968	Bug Telah Selesai	Bug "Error login pada halaman utama (Website E-Commerce)" pada project Website E-Commerce telah diselesaikan.	t	2025-10-25 14:10:40	2025-10-25 14:12:31
c6a8b6fd-4f42-4985-a046-a66aaf0d2c33	3c72459d-f919-4fb0-8ac4-325d34b28968	Status Bug Diperbarui	Status bug "Error login pada halaman utama (Mobile App Bug Tracker)" diperbarui menjadi dibuka.	t	2025-10-28 00:03:15	2025-10-28 00:21:19
06c06b03-1391-439e-8a1a-c44d98c383e5	3c72459d-f919-4fb0-8ac4-325d34b28968	Status Bug Diperbarui	Status bug "Perhitungan total harga tidak sesuai (Mobile App Bug Tracker)" diperbarui menjadi sedang ditangani.	t	2025-10-28 00:03:13	2025-10-28 00:21:22
\.


--
-- Data for Name: password_reset_otps; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.password_reset_otps (id, identifier, otp, token, is_used, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.projects (id, name, description, client_id, created_at, updated_at) FROM stdin;
b2f0edf4-602c-4ad8-b49e-055017df614a	Website E-Commerce	Project pengembangan website e-commerce untuk client.	3c72459d-f919-4fb0-8ac4-325d34b28968	2025-10-25 13:42:09	2025-10-25 13:42:09
7529d507-c7ed-4818-b1b3-08d29e9edbe6	Mobile App Bug Tracker	Project aplikasi mobile untuk tracking bug.	3c72459d-f919-4fb0-8ac4-325d34b28968	2025-10-25 13:42:09	2025-10-25 13:42:09
143f7a5b-a863-414e-bf54-4c0142aeb2eb	Company Profile Website	Project website profil perusahaan.	3c72459d-f919-4fb0-8ac4-325d34b28968	2025-10-25 13:42:09	2025-10-25 13:42:09
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
FEcAD1CjqHIpo4iioUkSgypdjQv3h7yAmEMIo4vI	3c72459d-f919-4fb0-8ac4-325d34b28968	192.168.65.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	YTo1OntzOjY6Il90b2tlbiI7czo0MDoiRzhseGVTYlFCTTFqeEwzR2lDMWRXanVxNVdRbEMyeWVDSmdMaWI0OSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozNjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2RldmVsb3Blci9idWdzIjt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO3M6MzY6IjNjNzI0NTlkLWY5MTktNGZiMC04YWM0LTMyNWQzNGIyODk2OCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9ub3RpZmljYXRpb25zL3VucmVhZC1jb3VudCI7fX0=	1761591199
yhH5aRwvlaSxOMk3igc27jDkp9DeItXlkPZ6de34	\N	192.168.65.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	YTo0OntzOjY6Il90b2tlbiI7czo0MDoiMlo1MFhnMElJamFJM29GRkYyNWVwTXFjVHZQSWtkRmM2M2tJS1Y4SiI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozMzoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2NsaWVudC9idWdzIjt9czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=	1761613512
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: laravel
--

COPY public.users (id, name, email, email_verified_at, password, role, remember_token, created_at, updated_at, phone, asal) FROM stdin;
3b4c2fc5-028d-45d1-9ae4-b6c2465a6ff2	Admin User	admin@example.com	\N	$2y$12$x9u8rqnv0IMMBSWLCaQPh.C/OJ6U6HwJfDyHyJ5LKVcwqTVAsLyne	admin	\N	2025-10-25 13:42:08	2025-10-25 13:42:08	6285755836281	\N
c544e93e-e022-4ddc-969c-09c5914020c6	Afzaal Dev	afzaal@example.com	\N	$2y$12$Ybz5kUH/nDvmGHgaX4ueduDFB2Xrz19ybmTZOy3zY3eIzWSr2KyiO	developer	\N	2025-10-25 13:42:08	2025-10-25 13:42:08	6287740174975	\N
d739b9f5-282a-4041-af54-f2273c63bbf6	Satya Dev	satya@example.com	\N	$2y$12$3YGIpnlFANC1LnyMBWOH3ejB2tJnp.PWt/OHxic1h3pbK01F2JcWC	developer	\N	2025-10-25 13:42:08	2025-10-25 13:42:08	6285755836281	\N
21e1bf5e-4b21-4dbc-b80f-1b0025e28c46	Developer User	dev@example.com	\N	$2y$12$hy.TXQ9u/IBCVz5b60igveivNxm/WFn4IwKGMI/XZkIlBt/70Da1O	developer	\N	2025-10-25 13:42:09	2025-10-25 13:42:09	6285755836281	\N
3c72459d-f919-4fb0-8ac4-325d34b28968	Client User	client@example.com	\N	$2y$12$EmaWk9LvzdcUk7kKkoqMYeZDERiuNajzXx6UdMuPPR0cJCtYK2lbW	client	\N	2025-10-25 13:42:09	2025-10-25 13:42:09	6287740174975	\N
850372fe-ca8c-4793-8914-c24fdb037f1f	Rosselvert	rosselvert@gmail.com	\N	$2y$12$d.iKBHZixI.CcMeFeOYZi.YkC9ENjVhm9Ia3kDLTIdL.JsdVytBPW	client	\N	2025-10-25 14:03:01	2025-10-25 14:03:01	628123456789	Madiun
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: laravel
--

SELECT pg_catalog.setval('public.migrations_id_seq', 16, true);


--
-- Name: password_reset_otps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: laravel
--

SELECT pg_catalog.setval('public.password_reset_otps_id_seq', 1, false);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: bugs bugs_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.bugs
    ADD CONSTRAINT bugs_pkey PRIMARY KEY (id);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: inbound_messages inbound_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.inbound_messages
    ADD CONSTRAINT inbound_messages_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: password_reset_otps password_reset_otps_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.password_reset_otps
    ADD CONSTRAINT password_reset_otps_pkey PRIMARY KEY (id);


--
-- Name: password_reset_otps password_reset_otps_token_unique; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.password_reset_otps
    ADD CONSTRAINT password_reset_otps_token_unique UNIQUE (token);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: attachments_bug_id_index; Type: INDEX; Schema: public; Owner: laravel
--

CREATE INDEX attachments_bug_id_index ON public.attachments USING btree (bug_id);


--
-- Name: attachments_uploaded_by_index; Type: INDEX; Schema: public; Owner: laravel
--

CREATE INDEX attachments_uploaded_by_index ON public.attachments USING btree (uploaded_by);


--
-- Name: password_reset_otps_identifier_otp_index; Type: INDEX; Schema: public; Owner: laravel
--

CREATE INDEX password_reset_otps_identifier_otp_index ON public.password_reset_otps USING btree (identifier, otp);


--
-- Name: password_reset_otps_token_index; Type: INDEX; Schema: public; Owner: laravel
--

CREATE INDEX password_reset_otps_token_index ON public.password_reset_otps USING btree (token);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: laravel
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: laravel
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: attachments attachments_bug_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_bug_id_foreign FOREIGN KEY (bug_id) REFERENCES public.bugs(id) ON DELETE CASCADE;


--
-- Name: attachments attachments_uploaded_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_uploaded_by_foreign FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bugs bugs_assigned_to_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.bugs
    ADD CONSTRAINT bugs_assigned_to_foreign FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: bugs bugs_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.bugs
    ADD CONSTRAINT bugs_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: bugs bugs_reported_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.bugs
    ADD CONSTRAINT bugs_reported_by_foreign FOREIGN KEY (reported_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_receiver_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_receiver_id_foreign FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_sender_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_sender_id_foreign FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: projects projects_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: laravel
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict u1DZvR9gr525nVoxAvvClVHFXZRLaycSbhgwVg1egvRJD0FMk0cFpm4eYs46WFx

