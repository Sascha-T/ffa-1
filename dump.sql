--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3 (Ubuntu 10.3-1.pgdg14.04+1)
-- Dumped by pg_dump version 10.3 (Ubuntu 10.3-1.pgdg14.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ages (
    guild_id character varying(18) NOT NULL,
    member integer NOT NULL
);


ALTER TABLE public.ages OWNER TO postgres;

--
-- Name: channels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channels (
    guild_id character varying(18) NOT NULL,
    log_id character varying(18),
    rules_id character varying(18),
    archive_id character varying(18),
    ignored_ids character varying(18)[] DEFAULT '{}'::character varying[] NOT NULL
);


ALTER TABLE public.channels OWNER TO postgres;

--
-- Name: chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat (
    delay integer NOT NULL,
    reward real NOT NULL,
    guild_id character varying(18) NOT NULL,
    decay real NOT NULL
);


ALTER TABLE public.chat OWNER TO postgres;

--
-- Name: custom_cmds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_cmds (
    guild_id character varying(18) NOT NULL,
    owner_id character varying(18) NOT NULL,
    name character varying(36) NOT NULL,
    response character varying(500) NOT NULL,
    uses integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.custom_cmds OWNER TO postgres;

--
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    guild_id character varying(18) NOT NULL,
    user_id character varying(18) NOT NULL,
    case_number integer NOT NULL,
    epoch integer NOT NULL,
    data jsonb,
    type smallint NOT NULL
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- Name: moderation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.moderation (
    guild_id character varying(18) NOT NULL,
    case_count integer DEFAULT 0 NOT NULL,
    max_actions smallint NOT NULL,
    auto_mute boolean NOT NULL,
    mute_length integer NOT NULL
);


ALTER TABLE public.moderation OWNER TO postgres;

--
-- Name: rep; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rep (
    guild_id character varying(18) NOT NULL,
    increase real NOT NULL,
    decrease real NOT NULL
);


ALTER TABLE public.rep OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    guild_id character varying(18) NOT NULL,
    muted_id character varying(18),
    mod_id character varying(18)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rules (
    guild_id character varying(18) NOT NULL,
    content character varying(512) NOT NULL,
    category character varying(32) NOT NULL,
    mute_length integer,
    epoch integer NOT NULL
);


ALTER TABLE public.rules OWNER TO postgres;

--
-- Name: spam; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spam (
    rep_penalty real NOT NULL,
    guild_id character varying(18) NOT NULL,
    msg_limit smallint NOT NULL,
    mute_length integer NOT NULL,
    duration integer NOT NULL
);


ALTER TABLE public.spam OWNER TO postgres;

--
-- Name: top; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.top (
    guild_id character varying(18) NOT NULL,
    color smallint NOT NULL,
    modify_cmds smallint NOT NULL,
    mod smallint NOT NULL,
    clear smallint NOT NULL
);


ALTER TABLE public.top OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    guild_id character varying(18) NOT NULL,
    user_id character varying(18) NOT NULL,
    reputation real DEFAULT 0 NOT NULL,
    in_guild boolean DEFAULT true NOT NULL,
    muted boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: ages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ages (guild_id, member) FROM stdin;
290759415362224139	172800
408765117447274498	172800
\.


--
-- Data for Name: channels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channels (guild_id, log_id, rules_id, archive_id, ignored_ids) FROM stdin;
408765117447274498	\N	452125090323365912	\N	{}
290759415362224139	455926419361628190	455926300234743830	\N	{}
\.


--
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat (delay, reward, guild_id, decay) FROM stdin;
30	0.025	408765117447274498	0.99
30	0.025	290759415362224139	0.99
\.


--
-- Data for Name: custom_cmds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_cmds (guild_id, owner_id, name, response, uses) FROM stdin;
\.


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs (guild_id, user_id, case_number, epoch, data, type) FROM stdin;
290759415362224139	322443225002541059	1	1530208616	{"rule": "gay", "length": 3600, "mod_id": "271424970796564490", "reason": "anal sex"}	0
290759415362224139	322443225002541059	2	1530208650	{"mod_id": "271424970796564490", "reason": "b"}	1
290759415362224139	456961251474407453	3	1530210840	{"rule": "gay", "length": 3600, "mod_id": "271424970796564490", "reason": "y not"}	0
290759415362224139	456961251474407453	4	1530210846	{"mod_id": "271424970796564490", "reason": "1"}	1
290759415362224139	259724110320369680	5	1530214006	{"rule": "gay", "length": 2592000, "mod_id": "252110962100928514", "reason": "REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"}	0
290759415362224139	252110962100928514	6	1530214301	{"length": 21600}	2
290759415362224139	252110962100928514	7	1530214306	{"mod_id": "291030069756035073", "reason": "6"}	1
290759415362224139	364391575842979840	8	1530214505	{"rule": "gay", "length": 108000, "mod_id": "252110962100928514", "reason": "one t~~two +#_%(+#)!??!?~,,__-~~~~~~~*~**$**~**$(@#!)L@K$!@M@~)(*#%_!)*~_)@*__~_@)%*_~******$#*@#*%**"}	0
290759415362224139	364391575842979840	9	1530214579	{"mod_id": "252110962100928514", "reason": "**"}	1
290759415362224139	242280574620925953	10	1530214612	{"rule": "gay", "length": 172800, "mod_id": "252110962100928514", "reason": "**"}	0
290759415362224139	175774730970857473	11	1530214624	{"rule": "gay", "mod_id": "364391575842979840", "reason": null, "quantity": 5}	4
290759415362224139	175774730970857473	12	1530214646	{"rule": "gay", "length": 3600, "mod_id": "364391575842979840", "reason": null}	0
290759415362224139	175774730970857473	13	1530214666	{"rule": "gay", "mod_id": "252110962100928514", "reason": null, "quantity": 11}	4
290759415362224139	175774730970857473	14	1530214723	{"mod_id": "364391575842979840", "reason": "nug"}	1
290759415362224139	175774730970857473	15	1530214962	{"rule": "gay", "length": 3600, "mod_id": "364391575842979840", "reason": "renut pls?"}	0
290759415362224139	175774730970857473	16	1530215140	{"mod_id": "364391575842979840", "reason": "a"}	1
290759415362224139	426034987670831114	17	1530379317	{"rule": "gay", "length": 3600, "mod_id": "364391575842979840", "reason": null}	0
290759415362224139	364391575842979840	18	1530379387	{"length": 21600}	2
290759415362224139	364391575842979840	19	1530379430	{"mod_id": "439999502628159499", "reason": "gaya"}	1
290759415362224139	426034987670831114	20	1530379928	{"mod_id": "439999502628159499", "reason": "k"}	1
290759415362224139	364391575842979840	21	1530380082	{"length": 21600}	2
290759415362224139	364391575842979840	22	1530380433	{"mod_id": "426034987670831114", "reason": "oh ya good succ"}	1
290759415362224139	364391575842979840	23	1530380518	{"length": 21600}	2
290759415362224139	364391575842979840	24	1530381197	{"mod_id": "439999502628159499", "reason": "I love you this much"}	1
290759415362224139	426034987670831114	25	1530381421	{"rule": "little willy tiny", "mod_id": "364391575842979840", "reason": null, "quantity": 14}	4
290759415362224139	242280574620925953	26	1530387445	\N	3
\.


--
-- Data for Name: moderation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.moderation (guild_id, case_count, max_actions, auto_mute, mute_length) FROM stdin;
408765117447274498	0	15	t	21600
290759415362224139	26	15	t	21600
\.


--
-- Data for Name: rep; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rep (guild_id, increase, decrease) FROM stdin;
408765117447274498	1	1
290759415362224139	1	1
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (guild_id, muted_id, mod_id) FROM stdin;
408765117447274498	\N	\N
290759415362224139	419857798118113302	460288816037756948
\.


--
-- Data for Name: rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rules (guild_id, content, category, mute_length, epoch) FROM stdin;
290759415362224139	gay	nugget	2592000	1528921662
290759415362224139	homophobes nugggg	suck fat cocks	300	1530379486
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380070
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380080
290759415362224139	little willy tiny	eljay baby nig nog	108000	1530380081
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380081
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380082
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380082
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380082
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380083
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380083
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380083
290759415362224139	little willy tiny	eljay baby nig nog	2592000	1530380084
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380940
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380944
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380944
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380944
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380945
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380945
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380945
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380946
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380946
290759415362224139	NUGGET ARE GATTT	lol kys dude for real	300	1530380946
\.


--
-- Data for Name: spam; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spam (rep_penalty, guild_id, msg_limit, mute_length, duration) FROM stdin;
2	290759415362224139	5	21600	4
2	408765117447274498	5	21600	4
\.


--
-- Data for Name: top; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.top (guild_id, color, modify_cmds, mod, clear) FROM stdin;
408765117447274498	40	20	20	20
290759415362224139	40	20	20	20
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (guild_id, user_id, reputation, in_guild, muted) FROM stdin;
\.


--
-- Name: ages ages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ages
    ADD CONSTRAINT ages_pkey PRIMARY KEY (guild_id);


--
-- Name: channels channels_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_config_pkey PRIMARY KEY (guild_id);


--
-- Name: chat chat_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_config_pkey PRIMARY KEY (guild_id);


--
-- Name: custom_cmds customcommands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_cmds
    ADD CONSTRAINT customcommands_pkey PRIMARY KEY (guild_id, name);


--
-- Name: logs logs_guild_id_case_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_guild_id_case_number_key UNIQUE (guild_id, case_number);


--
-- Name: moderation moderation_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation
    ADD CONSTRAINT moderation_config_pkey PRIMARY KEY (guild_id);


--
-- Name: rep rep_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rep
    ADD CONSTRAINT rep_config_pkey PRIMARY KEY (guild_id);


--
-- Name: roles roles_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_config_pkey PRIMARY KEY (guild_id);


--
-- Name: spam spam_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spam
    ADD CONSTRAINT spam_config_pkey PRIMARY KEY (guild_id);


--
-- Name: top top_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.top
    ADD CONSTRAINT top_config_pkey PRIMARY KEY (guild_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (guild_id, user_id);


--
-- Name: customcommands_guildid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX customcommands_guildid_idx ON public.custom_cmds USING btree (guild_id);


--
-- Name: rules_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX rules_id_idx ON public.rules USING btree (guild_id);


--
-- Name: TABLE ages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ages TO ffa;


--
-- Name: TABLE channels; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.channels TO ffa;


--
-- Name: TABLE chat; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.chat TO ffa;


--
-- Name: TABLE custom_cmds; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.custom_cmds TO ffa;


--
-- Name: TABLE logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.logs TO ffa;


--
-- Name: TABLE moderation; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.moderation TO ffa;


--
-- Name: TABLE rep; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rep TO ffa;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roles TO ffa;


--
-- Name: TABLE rules; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rules TO ffa;


--
-- Name: TABLE spam; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.spam TO ffa;


--
-- Name: TABLE top; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.top TO ffa;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO ffa;


--
-- PostgreSQL database dump complete
--

