--
-- PostgreSQL database dump
--

\restrict lhUE06aeAvTaFPud3MY9wZUma4ynZYzw97vy9pgDU1wWF3S5x5lJPYHI9pcHBCE

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-02 18:39:08

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 219 (class 1259 OID 16409)
-- Name: dim_days; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dim_days (
    day_id bigint,
    day_name text
);


ALTER TABLE public.dim_days OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16419)
-- Name: dim_faculty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dim_faculty (
    faculty_initial text,
    faculty_name text,
    faculty_id bigint
);


ALTER TABLE public.dim_faculty OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16414)
-- Name: dim_slots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dim_slots (
    slot_id bigint,
    start_time text,
    end_time text,
    is_break bigint
);


ALTER TABLE public.dim_slots OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16424)
-- Name: fact_workload; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fact_workload (
    term text,
    faculty_initials text,
    faculty_name text,
    subject_clean text,
    type text,
    hours bigint
);


ALTER TABLE public.fact_workload OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 16409)
-- Dependencies: 219
-- Data for Name: dim_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dim_days (day_id, day_name) FROM stdin;
1	Monday
2	Tuesday
3	Wednesday
4	Thursday
5	Friday
\.


--
-- TOC entry 5016 (class 0 OID 16419)
-- Dependencies: 221
-- Data for Name: dim_faculty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dim_faculty (faculty_initial, faculty_name, faculty_id) FROM stdin;
sm	Mr. Sandeep S. Mishra	1
ra	Ms. Rashmi R. Adatkar	2
pk	Dr. Pradnya V. Kamble	3
sp	Mr. Sunil D. Patil	4
mj	Mr. Martand S. Jha	5
pak	Unknown	6
ha	Mr. Harshawardhan P. Ahire	7
svm	Mr. Sagar V. Mhatre	8
td	Ms. Tilottama P. Dhake	9
pu	Mr. Prashant B. Upadhyay	10
ph	Dr. Priya T. Hankare	11
rk	Ms. Rupali S. Kadu	12
pg	Mrs. Priya Gupta	13
prh	Ms. Pranali P. Hatode	14
gd	Unknown	15
sk	Dr. Sandhya D. Kadam	16
na	Dr. Namrata Ansari	17
ak	Mr. Amit T. Kukreja	18
ds	Mr. Divesh Singh	19
vc	Ms. Vricha S. Chavan	20
ark	Unknown	21
ss	Ms. Swati H. Shinde	22
pp	Ms. Prahelika Pai	23
kr	Dr. Kiran R. Rathod	24
ar	Mrs. Anuprita Rane	25
jk	Dr. Jayashree V. Khanapuri	26
it	Unknown	27
pm	Unknown	28
sd	Dr. Sandhya S. Deshpande	29
ap	Dr. Anita Padhye	30
\.


--
-- TOC entry 5015 (class 0 OID 16414)
-- Dependencies: 220
-- Data for Name: dim_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dim_slots (slot_id, start_time, end_time, is_break) FROM stdin;
1	09:00	10:00	0
2	10:00	11:00	0
3	11:00	12:00	0
4	12:00	12:30	1
5	12:30	01:30	0
6	01:30	02:30	0
7	02:30	03:30	0
8	03:30	04:30	0
\.


--
-- TOC entry 5017 (class 0 OID 16424)
-- Dependencies: 222
-- Data for Name: fact_workload; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fact_workload (term, faculty_initials, faculty_name, subject_clean, type, hours) FROM stdin;
Odd(2023-24)	ap	Dr. Anita Padhye	BCE	practical	3
Odd(2023-24)	ap	Dr. Anita Padhye	BCE	theory	2
Odd(2023-24)	dt	Dr. Dhanashree Toradmalle	CSL	theory	3
Even(2025-26)	Unknown	Dr. Harshawardhan\nP. Ahire	MICROCONTROLLERS	practical	8
Even(2025-26)	Unknown	Dr. Harshawardhan\nP. Ahire	PROJECT	practical	2
Even(2025-26)	Unknown	Dr. Harshawardhan\nP. Ahire	OPERATION RESEARCH	theory	3
Even(2023-24)	jk	Dr. Jayashree  V. Khanapuri	IPMV	practical	2
Even(2023-24)	jk	Dr. Jayashree  V. Khanapuri	IPMV	theory	3
Even(2023-24)	jk	Dr. Jayashree  V. Khanapuri	MAJOR PROJECT	theory	2
Even(2025-26)	jk	Dr. Jayashree  V. Khanapuri	IPMV	practical	6
Even(2025-26)	jk	Dr. Jayashree  V. Khanapuri	PROJECT	practical	2
Even(2025-26)	jk	Dr. Jayashree  V. Khanapuri	IPMV	theory	3
Odd(2023-24)	jk	Dr. Jayashree  V. Khanapuri	DCE	practical	1
Odd(2023-24)	jk	Dr. Jayashree  V. Khanapuri	DSA	practical	1
Odd(2023-24)	jk	Dr. Jayashree  V. Khanapuri	DCE	theory	3
Odd(2023-24)	jk	Dr. Jayashree  V. Khanapuri	PROJECT	theory	2
Odd(2024-25)	jk	Dr. Jayashree  V. Khanapuri	AI	practical	1
Odd(2024-25)	jk	Dr. Jayashree  V. Khanapuri	DSA	practical	1
Odd(2024-25)	jk	Dr. Jayashree  V. Khanapuri	AI	theory	3
Odd(2024-25)	jk	Dr. Jayashree  V. Khanapuri	PROJECT	theory	2
Unknown	jk	Dr. Jayashree  V. Khanapuri	AI	practical	6
Unknown	jk	Dr. Jayashree  V. Khanapuri	IPMV	practical	4
Unknown	jk	Dr. Jayashree  V. Khanapuri	PROJECT	practical	2
Unknown	jk	Dr. Jayashree  V. Khanapuri	PROJECT	practical	2
Unknown	jk	Dr. Jayashree  V. Khanapuri	AI	theory	1
Unknown	jk	Dr. Jayashree  V. Khanapuri	IPMV	theory	3
Even(2023-24)	kr	Dr. Kiran R. Rathod	EMA	practical	4
Even(2023-24)	kr	Dr. Kiran R. Rathod	EMA	theory	3
Even(2023-24)	kr	Dr. Kiran R. Rathod	EMA	theory	3
Even(2023-24)	kr	Dr. Kiran R. Rathod	MAJOR PROJECT	theory	2
Even(2025-26)	kr	Dr. Kiran R. Rathod	ELECTROMAGNETICS AND ANTENNA	practical	8
Even(2025-26)	kr	Dr. Kiran R. Rathod	PROJECT	practical	2
Even(2025-26)	kr	Dr. Kiran R. Rathod	ELECTROMAGNETICS AND ANTENNA	theory	3
Even(2025-26)	kr	Dr. Kiran R. Rathod	ELECTROMAGNETICS AND ANTENNA	theory	3
Odd(2023-24)	kr	Dr. Kiran R. Rathod	MWE	practical	4
Odd(2023-24)	kr	Dr. Kiran R. Rathod	MEW	theory	3
Odd(2023-24)	kr	Dr. Kiran R. Rathod	MEW	theory	3
Odd(2023-24)	kr	Dr. Kiran R. Rathod	PROJECT	theory	2
Odd(2024-25)	kr	Dr. Kiran R. Rathod	MWE	practical	4
Odd(2024-25)	kr	Dr. Kiran R. Rathod	MWE	theory	3
Odd(2024-25)	kr	Dr. Kiran R. Rathod	MWE	theory	3
Odd(2024-25)	kr	Dr. Kiran R. Rathod	PROJECT	theory	2
Unknown	kr	Dr. Kiran R. Rathod	EMA	practical	6
Unknown	kr	Dr. Kiran R. Rathod	MWE	practical	8
Unknown	kr	Dr. Kiran R. Rathod	PBL	practical	2
Unknown	kr	Dr. Kiran R. Rathod	PROJECT	practical	2
Unknown	kr	Dr. Kiran R. Rathod	PROJECT	practical	2
Unknown	kr	Dr. Kiran R. Rathod	EMA (A)	theory	3
Unknown	kr	Dr. Kiran R. Rathod	EMA (B)	theory	3
Unknown	kr	Dr. Kiran R. Rathod	MWE	theory	3
Unknown	kr	Dr. Kiran R. Rathod	MWE	theory	3
Even(2023-24)	na	Dr. Namrata Ansari	IOT	theory	4
Even(2023-24)	na	Dr. Namrata Ansari	MAJOR PROJECT	theory	2
Even(2025-26)	na	Dr. Namrata Ansari	IOT	practical	4
Even(2025-26)	na	Dr. Namrata Ansari	PBL-II	practical	2
Even(2025-26)	na	Dr. Namrata Ansari	PROJECT	practical	2
Even(2025-26)	na	Dr. Namrata Ansari	CSL	theory	3
Odd(2023-24)	na	Dr. Namrata Ansari	EDC	theory	3
Odd(2023-24)	na	Dr. Namrata Ansari	EDC	theory	3
Odd(2023-24)	na	Dr. Namrata Ansari	PROJECT	theory	2
Odd(2024-25)	na	Dr. Namrata Ansari	HONORS	practical	2
Odd(2024-25)	na	Dr. Namrata Ansari	HONORS	theory	4
Odd(2024-25)	na	Dr. Namrata Ansari	PROJECT	theory	2
Unknown	na	Dr. Namrata Ansari	EDLC	practical	2
Unknown	na	Dr. Namrata Ansari	IOT + CLOUD	practical	2
Unknown	na	Dr. Namrata Ansari	PROJECT	practical	2
Unknown	na	Dr. Namrata Ansari	PROJECT	practical	2
Unknown	na	Dr. Namrata Ansari	CCS	theory	1
Unknown	na	Dr. Namrata Ansari	EDLC	theory	3
Unknown	na	Dr. Namrata Ansari	IOT (MI)	theory	3
Odd(2023-24)	pv	Dr. Payal Varngaonkar	CS	practical	2
Odd(2023-24)	pv	Dr. Payal Varngaonkar	EDC	practical	4
Odd(2023-24)	pv	Dr. Payal Varngaonkar	CS	theory	4
Even(2025-26)	pk	Dr. Pradnya V. Kamble	PROJECT	practical	2
Even(2025-26)	pk	Dr. Pradnya V. Kamble	SKILL ENHANCEMENT(SAT-VIII): SKILL BASED LEARNING  (PYTHON PROGRAMMING)	practical	8
Even(2025-26)	pk	Dr. Pradnya V. Kamble	IOT & CLOUD COMPUTING	theory	3
Even(2025-26)	pk	Dr. Pradnya V. Kamble	IOT & CLOUD COMPUTING    [COMP]	theory	3
Even(2025-26)	Unknown	Dr. Pranali P. Hatode	AIML	practical	2
Even(2025-26)	Unknown	Dr. Pranali P. Hatode	PROJECT	practical	2
Even(2025-26)	Unknown	Dr. Pranali P. Hatode	SKILL ENHANCEMENT(SAT-VIII): SKILL BASED LEARNING  (PYTHON PROGRAMMING)	practical	8
Even(2025-26)	Unknown	Dr. Pranali P. Hatode	AI	theory	3
Even(2023-24)	ph	Dr. Priya T. Hankare	ML	practical	4
Even(2023-24)	ph	Dr. Priya T. Hankare	MAJOR PROJECT	theory	2
Even(2023-24)	ph	Dr. Priya T. Hankare	ML	theory	3
Even(2023-24)	ph	Dr. Priya T. Hankare	PBL - III	theory	1
Even(2023-24)	ph	Dr. Priya T. Hankare	TBL-X	theory	1
Even(2025-26)	ph	Dr. Priya T. Hankare	FDS	practical	8
Even(2025-26)	ph	Dr. Priya T. Hankare	PROJECT	practical	2
Even(2025-26)	ph	Dr. Priya T. Hankare	AI	theory	3
Even(2025-26)	ph	Dr. Priya T. Hankare	FDS	theory	3
Odd(2023-24)	ph	Dr. Priya T. Hankare	CCS	practical	1
Odd(2023-24)	ph	Dr. Priya T. Hankare	DTSP	practical	5
Odd(2023-24)	ph	Dr. Priya T. Hankare	DTSP	theory	3
Odd(2023-24)	ph	Dr. Priya T. Hankare	PROJECT	theory	2
Odd(2024-25)	ph	Dr. Priya T. Hankare	DTSP	practical	4
Odd(2024-25)	ph	Dr. Priya T. Hankare	SBL-VII	practical	2
Odd(2024-25)	ph	Dr. Priya T. Hankare	DTSP	theory	3
Odd(2024-25)	ph	Dr. Priya T. Hankare	PROJECT	theory	2
Unknown	ph	Dr. Priya T. Hankare	DTSP	practical	8
Unknown	ph	Dr. Priya T. Hankare	ML	practical	8
Unknown	ph	Dr. Priya T. Hankare	PROJECT	practical	2
Unknown	ph	Dr. Priya T. Hankare	PROJECT	practical	2
Unknown	ph	Dr. Priya T. Hankare	SAT-VII	practical	4
Unknown	ph	Dr. Priya T. Hankare	SBL (LIN)	practical	4
Unknown	ph	Dr. Priya T. Hankare	DTSP	theory	3
Unknown	ph	Dr. Priya T. Hankare	ML	theory	3
Even(2023-24)	sk	Dr. Sandhya D. Kadam	IPMV	practical	5
Even(2023-24)	sk	Dr. Sandhya D. Kadam	IPMV	theory	3
Even(2023-24)	sk	Dr. Sandhya D. Kadam	MAJOR PROJECT	theory	2
Even(2025-26)	sk	Dr. Sandhya D. Kadam	IPMV	practical	10
Even(2025-26)	sk	Dr. Sandhya D. Kadam	PBL-II	practical	2
Even(2025-26)	sk	Dr. Sandhya D. Kadam	PROJECT	practical	2
Even(2025-26)	sk	Dr. Sandhya D. Kadam	IPMV	theory	3
Odd(2023-24)	sk	Dr. Sandhya D. Kadam	DLD	practical	4
Odd(2023-24)	sk	Dr. Sandhya D. Kadam	DLD	theory	3
Odd(2023-24)	sk	Dr. Sandhya D. Kadam	DLD	theory	3
Odd(2023-24)	sk	Dr. Sandhya D. Kadam	PROJECT	theory	2
Odd(2024-25)	sk	Dr. Sandhya D. Kadam	DLD	practical	3
Odd(2024-25)	sk	Dr. Sandhya D. Kadam	DLD	theory	3
Odd(2024-25)	sk	Dr. Sandhya D. Kadam	DLD	theory	3
Odd(2024-25)	sk	Dr. Sandhya D. Kadam	PROJECT	theory	2
Odd(2024-25)	sk	Dr. Sandhya D. Kadam	TBL+SBL	theory	2
Unknown	sk	Dr. Sandhya D. Kadam	AI	practical	4
Unknown	sk	Dr. Sandhya D. Kadam	AI	practical	2
Unknown	sk	Dr. Sandhya D. Kadam	IPMV	practical	6
Unknown	sk	Dr. Sandhya D. Kadam	PBL-II	practical	6
Unknown	sk	Dr. Sandhya D. Kadam	PROJECT	practical	2
Unknown	sk	Dr. Sandhya D. Kadam	PROJECT	practical	2
Unknown	sk	Dr. Sandhya D. Kadam	WD	practical	6
Unknown	sk	Dr. Sandhya D. Kadam	AI	theory	3
Unknown	sk	Dr. Sandhya D. Kadam	IPMV	theory	3
Even(2025-26)	sd	Dr. Sandhya S. Deshpande	PROJECT	practical	2
Even(2025-26)	sd	Dr. Sandhya S. Deshpande	ABILITY ENHANCEMENT(SAT-IX): SKILL BASED LEARNING  (FOREIGN & INDIAN MODERN LANGUAGES-II)	theory	2
Even(2025-26)	sd	Dr. Sandhya S. Deshpande	CSL	theory	3
Even(2025-26)	sd	Dr. Sandhya S. Deshpande	ENVIRONMENTAL MANAGEMENT	theory	3
Odd(2023-24)	vd	Dr. Vrushali Deole	BCE	practical	1
Odd(2024-25)	Unknown	English Faculty	BCE	practical	4
Odd(2024-25)	Unknown	English Faculty	BCE	practical	4
Odd(2024-25)	Unknown	English Faculty	BCE	theory	2
Odd(2024-25)	Unknown	English Faculty	BCE	theory	2
Odd(2024-25)	Unknown	Maths Faculty	AME-I	theory	3
Odd(2024-25)	Unknown	Maths Faculty	AME-I	theory	3
Odd(2024-25)	Unknown	Maths Faculty	AME-I(TUT)	theory	3
Odd(2024-25)	Unknown	Maths Faculty	AME-I(TUT)	theory	3
Even(2023-24)	ak	Mr. Amit T. Kukreja	WD	practical	4
Even(2023-24)	ak	Mr. Amit T. Kukreja	MAJOR PROJECT	theory	2
Even(2023-24)	ak	Mr. Amit T. Kukreja	WD	theory	3
Even(2023-24)	ak	Mr. Amit T. Kukreja	WD	theory	3
Even(2025-26)	ak	Mr. Amit T. Kukreja	PROJECT	practical	2
Even(2025-26)	ak	Mr. Amit T. Kukreja	WD	practical	8
Even(2025-26)	ak	Mr. Amit T. Kukreja	WD	theory	3
Even(2025-26)	ak	Mr. Amit T. Kukreja	WD	theory	3
Odd(2023-24)	ak	Mr. Amit T. Kukreja	BDA	practical	3
Odd(2023-24)	ak	Mr. Amit T. Kukreja	DLD	practical	2
Odd(2023-24)	ak	Mr. Amit T. Kukreja	BDA	theory	3
Odd(2023-24)	ak	Mr. Amit T. Kukreja	PROJECT	theory	2
Odd(2024-25)	ak	Mr. Amit T. Kukreja	BDA	practical	4
Odd(2024-25)	ak	Mr. Amit T. Kukreja	BDA	theory	3
Odd(2024-25)	ak	Mr. Amit T. Kukreja	BDA	theory	3
Odd(2024-25)	ak	Mr. Amit T. Kukreja	PROJECT	theory	2
Unknown	ak	Mr. Amit T. Kukreja	BDA	practical	2
Unknown	ak	Mr. Amit T. Kukreja	DBMS	practical	4
Unknown	ak	Mr. Amit T. Kukreja	PROJECT	practical	2
Unknown	ak	Mr. Amit T. Kukreja	PROJECT	practical	2
Unknown	ak	Mr. Amit T. Kukreja	SAT-VII	practical	8
Unknown	ak	Mr. Amit T. Kukreja	SBL (LIN)	practical	2
Unknown	ak	Mr. Amit T. Kukreja	WD	practical	2
Unknown	ak	Mr. Amit T. Kukreja	BDA	theory	3
Unknown	ak	Mr. Amit T. Kukreja	SBL-X	theory	2
Unknown	ak	Mr. Amit T. Kukreja	WD (A)	theory	3
Unknown	ak	Mr. Amit T. Kukreja	WD (B)	theory	3
Unknown	dd	Mr. Datta Deshmukh	DLD	theory	3
Odd(2023-24)	ds	Mr. Divesh Singh	AM-III	theory	3
Odd(2023-24)	ds	Mr. Divesh Singh	AM-III	theory	3
Odd(2023-24)	ds	Mr. Divesh Singh	AM-III	theory	2
Even(2023-24)	Unknown	Mr. Harshawardhan\nP. Ahire	FDS	practical	2
Even(2023-24)	Unknown	Mr. Harshawardhan\nP. Ahire	LIC	practical	2
Even(2023-24)	Unknown	Mr. Harshawardhan\nP. Ahire	FDS	theory	3
Even(2023-24)	Unknown	Mr. Harshawardhan\nP. Ahire	MAJOR PROJECT	theory	2
Even(2023-24)	Unknown	Mr. Harshawardhan\nP. Ahire	TBL-X	theory	1
Odd(2023-24)	Unknown	Mr. Harshawardhan\nP. Ahire	BEE	practical	4
Odd(2023-24)	Unknown	Mr. Harshawardhan\nP. Ahire	BEE	theory	3
Odd(2023-24)	Unknown	Mr. Harshawardhan\nP. Ahire	BEE	theory	3
Odd(2023-24)	Unknown	Mr. Harshawardhan\nP. Ahire	PROJECT	theory	2
Odd(2024-25)	Unknown	Mr. Harshawardhan\nP. Ahire	EICS	practical	1
Odd(2024-25)	Unknown	Mr. Harshawardhan\nP. Ahire	NNDL	practical	2
Odd(2024-25)	Unknown	Mr. Harshawardhan\nP. Ahire	EICS	theory	3
Odd(2024-25)	Unknown	Mr. Harshawardhan\nP. Ahire	EICS	theory	3
Odd(2024-25)	Unknown	Mr. Harshawardhan\nP. Ahire	NNDL	theory	3
Odd(2024-25)	Unknown	Mr. Harshawardhan\nP. Ahire	PROJECT	theory	2
Unknown	Unknown	Mr. Harshawardhan\nP. Ahire	AI	practical	6
Unknown	Unknown	Mr. Harshawardhan\nP. Ahire	EICS	practical	8
Unknown	Unknown	Mr. Harshawardhan\nP. Ahire	FDS	practical	2
Unknown	Unknown	Mr. Harshawardhan\nP. Ahire	PROJECT	practical	2
Unknown	Unknown	Mr. Harshawardhan\nP. Ahire	PROJECT	practical	2
Unknown	Unknown	Mr. Harshawardhan\nP. Ahire	EICS	theory	3
Unknown	Unknown	Mr. Harshawardhan\nP. Ahire	EICS	theory	3
Unknown	Unknown	Mr. Harshawardhan\nP. Ahire	FDS (DLEC)	theory	3
Unknown	Unknown	Mr. Harshawardhan\nP. Ahire	FDS (DLEC)	theory	3
Even(2023-24)	mj	Mr. Martand S. Jha	OFC	practical	4
Even(2023-24)	mj	Mr. Martand S. Jha	FM(ILOC)	theory	3
Even(2023-24)	mj	Mr. Martand S. Jha	MAJOR PROJECT	theory	2
Even(2023-24)	mj	Mr. Martand S. Jha	SBL-VI	theory	1
Even(2023-24)	mj	Mr. Martand S. Jha	TBL-X	theory	1
Even(2025-26)	mj	Mr. Martand S. Jha	OCN	practical	4
Even(2025-26)	mj	Mr. Martand S. Jha	PBL-II	practical	6
Even(2025-26)	mj	Mr. Martand S. Jha	PROJECT	practical	2
Even(2025-26)	mj	Mr. Martand S. Jha	FINANCE MANAGEMENT	theory	3
Even(2025-26)	mj	Mr. Martand S. Jha	PBL-II	theory	1
Odd(2023-24)	mj	Mr. Martand S. Jha	BEE	practical	4
Odd(2023-24)	mj	Mr. Martand S. Jha	BEE	theory	3
Odd(2023-24)	mj	Mr. Martand S. Jha	BEE	theory	3
Odd(2023-24)	mj	Mr. Martand S. Jha	PROJECT	theory	2
Odd(2024-25)	mj	Mr. Martand S. Jha	BEE	practical	4
Odd(2024-25)	mj	Mr. Martand S. Jha	BEE	theory	3
Odd(2024-25)	mj	Mr. Martand S. Jha	BEE	theory	3
Odd(2024-25)	mj	Mr. Martand S. Jha	PROJECT	theory	2
Unknown	mj	Mr. Martand S. Jha	OCN	practical	6
Unknown	mj	Mr. Martand S. Jha	PBL	practical	4
Unknown	mj	Mr. Martand S. Jha	PROJECT	practical	2
Unknown	mj	Mr. Martand S. Jha	PROJECT	practical	2
Unknown	mj	Mr. Martand S. Jha	SBL (LIN)	practical	2
Unknown	mj	Mr. Martand S. Jha	PBL	theory	1
Unknown	mj	Mr. Martand S. Jha	PBL	theory	1
Unknown	pd	Mr. Pankaj Deshmukh	EDLC	practical	8
Even(2023-24)	pu	Mr. Prashant B. Upadhyay	AV	practical	2
Even(2023-24)	pu	Mr. Prashant B. Upadhyay	MC	practical	2
Even(2023-24)	pu	Mr. Prashant B. Upadhyay	AV	theory	3
Even(2023-24)	pu	Mr. Prashant B. Upadhyay	MAJOR PROJECT	theory	2
Even(2023-24)	pu	Mr. Prashant B. Upadhyay	PBL - II	theory	2
Even(2025-26)	pu	Mr. Prashant B. Upadhyay	AUTONOMOUS VEHICLE	practical	4
Even(2025-26)	pu	Mr. Prashant B. Upadhyay	PBL-II	practical	6
Even(2025-26)	pu	Mr. Prashant B. Upadhyay	PROJECT	practical	2
Even(2025-26)	pu	Mr. Prashant B. Upadhyay	AUTONOMOUS VEHICLE	theory	3
Even(2025-26)	pu	Mr. Prashant B. Upadhyay	PBL-II	theory	1
Odd(2024-25)	pu	Mr. Prashant B. Upadhyay	EDC	practical	2
Odd(2024-25)	pu	Mr. Prashant B. Upadhyay	ROBO	practical	2
Odd(2024-25)	pu	Mr. Prashant B. Upadhyay	PBL	theory	1
Odd(2024-25)	pu	Mr. Prashant B. Upadhyay	PBL	theory	1
Odd(2024-25)	pu	Mr. Prashant B. Upadhyay	PROJECT	theory	2
Odd(2024-25)	pu	Mr. Prashant B. Upadhyay	ROBO	theory	3
Unknown	pu	Mr. Prashant B. Upadhyay	AV	practical	4
Unknown	pu	Mr. Prashant B. Upadhyay	EDLC	practical	6
Unknown	pu	Mr. Prashant B. Upadhyay	MVLSI (DLE)	practical	2
Unknown	pu	Mr. Prashant B. Upadhyay	PBL-I	practical	4
Unknown	pu	Mr. Prashant B. Upadhyay	PROJECT	practical	2
Unknown	pu	Mr. Prashant B. Upadhyay	PROJECT	practical	2
Unknown	pu	Mr. Prashant B. Upadhyay	AV (DLEC)	theory	3
Unknown	pu	Mr. Prashant B. Upadhyay	EDLC	theory	3
Unknown	pu	Mr. Prashant B. Upadhyay	MVLSI (DLE)	theory	3
Unknown	pu	Mr. Prashant B. Upadhyay	PBL-I	theory	2
Odd(2023-24)	pu	Mr. Prashant B.Upadhyay	EDC	practical	2
Odd(2023-24)	pu	Mr. Prashant B.Upadhyay	ROBO	practical	2
Odd(2023-24)	pu	Mr. Prashant B.Upadhyay	PBL MINI	theory	2
Odd(2023-24)	pu	Mr. Prashant B.Upadhyay	PROJECT	theory	2
Odd(2023-24)	pu	Mr. Prashant B.Upadhyay	ROBO	theory	3
Even(2023-24)	svm	Mr. Sagar V. Mhatre	ML	practical	1
Even(2023-24)	svm	Mr. Sagar V. Mhatre	SOC	practical	1
Even(2023-24)	svm	Mr. Sagar V. Mhatre	MAJOR PROJECT	theory	2
Even(2023-24)	svm	Mr. Sagar V. Mhatre	ML	theory	3
Even(2023-24)	svm	Mr. Sagar V. Mhatre	PBL - III	theory	1
Even(2023-24)	svm	Mr. Sagar V. Mhatre	SOC	theory	3
Even(2025-26)	svm	Mr. Sagar V. Mhatre	PROJECT	practical	2
Even(2025-26)	svm	Mr. Sagar V. Mhatre	VOCATIONAL SKILL – SAT XII:  \nTECHNOLOGY BASED LEARNING	practical	12
Even(2025-26)	svm	Mr. Sagar V. Mhatre	VERY LARGE SCALE INTEGRATED CIRCUITS	theory	3
Odd(2023-24)	svm	Mr. Sagar V. Mhatre	DVD	practical	4
Odd(2023-24)	svm	Mr. Sagar V. Mhatre	DVD	theory	3
Odd(2023-24)	svm	Mr. Sagar V. Mhatre	DVD	theory	3
Odd(2023-24)	svm	Mr. Sagar V. Mhatre	PROJECT	theory	2
Odd(2024-25)	svm	Mr. Sagar V. Mhatre	VLSI	practical	3
Odd(2024-25)	svm	Mr. Sagar V. Mhatre	PBL	theory	1
Odd(2024-25)	svm	Mr. Sagar V. Mhatre	PBL	theory	1
Odd(2024-25)	svm	Mr. Sagar V. Mhatre	PROJECT	theory	2
Odd(2024-25)	svm	Mr. Sagar V. Mhatre	VLSI	theory	3
Odd(2024-25)	svm	Mr. Sagar V. Mhatre	VLSI	theory	3
Unknown	svm	Mr. Sagar V. Mhatre	DVD	practical	4
Unknown	svm	Mr. Sagar V. Mhatre	PBL	practical	2
Unknown	svm	Mr. Sagar V. Mhatre	PBL-II	practical	2
Unknown	svm	Mr. Sagar V. Mhatre	PROJECT	practical	2
Unknown	svm	Mr. Sagar V. Mhatre	PROJECT	practical	2
Unknown	svm	Mr. Sagar V. Mhatre	SOC	practical	2
Unknown	svm	Mr. Sagar V. Mhatre	VLSI	practical	4
Unknown	svm	Mr. Sagar V. Mhatre	VLSI (MI)	practical	4
Unknown	svm	Mr. Sagar V. Mhatre	DVD	theory	3
Unknown	svm	Mr. Sagar V. Mhatre	SOC (DLEC)	theory	3
Unknown	svm	Mr. Sagar V. Mhatre	VLSI	theory	1
Unknown	svm	Mr. Sagar V. Mhatre	VLSI (MI)	theory	3
Even(2023-24)	sm	Mr. Sandeep S. Mishra	DBMS	practical	2
Even(2023-24)	sm	Mr. Sandeep S. Mishra	LIC	practical	2
Even(2023-24)	sm	Mr. Sandeep S. Mishra	LIC	theory	3
Even(2023-24)	sm	Mr. Sandeep S. Mishra	LIC	theory	3
Even(2023-24)	sm	Mr. Sandeep S. Mishra	MAJOR PROJECT	theory	2
Even(2025-26)	sm	Mr. Sandeep S. Mishra	IOT & CLOUD COMPUTING  [AIDS]	practical	8
Even(2025-26)	sm	Mr. Sandeep S. Mishra	PROJECT	practical	2
Even(2025-26)	sm	Mr. Sandeep S. Mishra	IOT & CLOUD COMPUTING  [AIDS]	theory	3
Even(2025-26)	sm	Mr. Sandeep S. Mishra	IOT & CLOUD COMPUTING  [AIDS]	theory	3
Odd(2023-24)	sm	Mr. Sandeep S. Mishra	EICS	practical	4
Odd(2023-24)	sm	Mr. Sandeep S. Mishra	EICS	theory	3
Odd(2023-24)	sm	Mr. Sandeep S. Mishra	EICS	theory	3
Odd(2023-24)	sm	Mr. Sandeep S. Mishra	PROJECT	theory	2
Odd(2024-25)	sm	Mr. Sandeep S. Mishra	EICS	practical	4
Odd(2024-25)	sm	Mr. Sandeep S. Mishra	ST	practical	2
Odd(2024-25)	sm	Mr. Sandeep S. Mishra	PROJECT	theory	2
Odd(2024-25)	sm	Mr. Sandeep S. Mishra	ST	theory	3
Unknown	sm	Mr. Sandeep S. Mishra	IOT MINOR (AIDS)	practical	6
Unknown	sm	Mr. Sandeep S. Mishra	IOT+CLOUD	practical	10
Unknown	sm	Mr. Sandeep S. Mishra	PBL	practical	2
Unknown	sm	Mr. Sandeep S. Mishra	PBL-I	practical	2
Unknown	sm	Mr. Sandeep S. Mishra	PROJECT	practical	2
Unknown	sm	Mr. Sandeep S. Mishra	PROJECT	practical	2
Unknown	sm	Mr. Sandeep S. Mishra	ST	practical	2
Unknown	sm	Mr. Sandeep S. Mishra	IOT + CLOUD	theory	3
Unknown	sm	Mr. Sandeep S. Mishra	IOT MINOR (AIDS)	theory	1
Unknown	sm	Mr. Sandeep S. Mishra	ST	theory	3
Even(2023-24)	sp	Mr. Sunil D. Patil	EMA	practical	4
Even(2023-24)	sp	Mr. Sunil D. Patil	MAJOR PROJECT	theory	2
Even(2023-24)	sp	Mr. Sunil D. Patil	SS	theory	3
Even(2023-24)	sp	Mr. Sunil D. Patil	SS	theory	3
Even(2025-26)	sp	Mr. Sunil D. Patil	ELECTROMAGNETICS AND ANTENNA	practical	8
Even(2025-26)	sp	Mr. Sunil D. Patil	PROJECT	practical	2
Even(2025-26)	sp	Mr. Sunil D. Patil	SIGNALS AND SYSTEMS	theory	3
Even(2025-26)	sp	Mr. Sunil D. Patil	SIGNALS AND SYSTEMS	theory	3
Odd(2023-24)	sp	Mr. Sunil D. Patil	BEE	practical	8
Odd(2023-24)	sp	Mr. Sunil D. Patil	PROJECT	theory	2
Odd(2023-24)	sp	Mr. Sunil D. Patil	RSA	theory	3
Odd(2023-24)	sp	Mr. Sunil D. Patil	RSA	theory	3
Odd(2024-25)	sp	Mr. Sunil D. Patil	EDC	practical	1
Odd(2024-25)	sp	Mr. Sunil D. Patil	ENT	theory	3
Odd(2024-25)	sp	Mr. Sunil D. Patil	ENT	theory	3
Odd(2024-25)	sp	Mr. Sunil D. Patil	PROJECT	theory	2
Odd(2024-25)	sp	Mr. Sunil D. Patil	RSA	theory	3
Odd(2024-25)	sp	Mr. Sunil D. Patil	RSA	theory	3
Unknown	sp	Mr. Sunil D. Patil	EMA	practical	6
Unknown	sp	Mr. Sunil D. Patil	PBL	practical	2
Unknown	sp	Mr. Sunil D. Patil	PROJECT	practical	2
Unknown	sp	Mr. Sunil D. Patil	PROJECT	practical	2
Unknown	sp	Mr. Sunil D. Patil	ENT	theory	3
Unknown	sp	Mr. Sunil D. Patil	ENT	theory	3
Unknown	sp	Mr. Sunil D. Patil	SS (A)	theory	3
Unknown	sp	Mr. Sunil D. Patil	SS (B)	theory	3
Odd(2024-25)	ar	Mrs. Anuprita Rane	BEE	practical	6
Odd(2024-25)	ar	Mrs. Anuprita Rane	BEE	theory	3
Odd(2024-25)	ar	Mrs. Anuprita Rane	BEE	theory	3
Unknown	ar	Mrs. Anuprita Rane	BEE	practical	6
Unknown	ar	Mrs. Anuprita Rane	SAT-VII	practical	2
Unknown	ar	Mrs. Anuprita Rane	BEE	theory	3
Unknown	dnd	Mrs. Dnyada Dafale	DLD	practical	6
Odd(2024-25)	ep	Mrs. Ekta Pandit	BDA	practical	2
Odd(2024-25)	ep	Mrs. Ekta Pandit	SBL-VII	practical	6
Odd(2024-25)	mp	Mrs. Meghana Patil	BEE	practical	5
Odd(2024-25)	mp	Mrs. Meghana Patil	BEE	theory	3
Odd(2024-25)	mp	Mrs. Meghana Patil	BEE	theory	3
Unknown	mp	Mrs. Meghana Patil	DVD	practical	12
Unknown	mp	Mrs. Meghana Patil	PBL-II	practical	2
Unknown	mp	Mrs. Meghana Patil	DVD	theory	3
Unknown	Unknown	Mrs. Nisha Vanjari	WN	practical	4
Unknown	Unknown	Mrs. Nisha Vanjari	WN	theory	3
Even(2023-24)	pg	Mrs. Priya Gupta	CP	practical	5
Even(2023-24)	pg	Mrs. Priya Gupta	PM(ILOC)	theory	3
Even(2023-24)	pg	Mrs. Priya Gupta	SBL-VI	theory	3
Odd(2024-25)	pg	Mrs. Priya Gupta	EDC	practical	5
Odd(2024-25)	pg	Mrs. Priya Gupta	EDLC	theory	3
Odd(2024-25)	pg	Mrs. Priya Gupta	EDLC	theory	3
Odd(2024-25)	pg	Mrs. Priya Gupta	PROJECT	theory	2
Even(2023-24)	rr	Mrs. Reshma Rasal	WD	practical	3
Even(2023-24)	rr	Mrs. Reshma Rasal	CP	theory	3
Even(2023-24)	rr	Mrs. Reshma Rasal	CP	theory	3
Even(2023-24)	rr	Mrs. Reshma Rasal	TBL-X	theory	1
Unknown	vs	Mrs. Vandana Salve	DLD	theory	3
Even(2025-26)	Unknown	Ms. Anuprita Rane	IOT & CLOUD COMPUTING	practical	2
Even(2025-26)	Unknown	Ms. Anuprita Rane	PROJECT	practical	2
Even(2025-26)	Unknown	Ms. Anuprita Rane	WD	practical	10
Even(2025-26)	Unknown	Ms. Anuprita Rane	MICROCONTROLLERS(IT DEPT)	theory	3
Unknown	Unknown	Ms. Anuprita Rane	SBL (PY)	practical	10
Unknown	Unknown	Ms. Anuprita Rane	CCN	theory	3
Unknown	Unknown	Ms. Anuprita Rane	CCN	theory	3
Odd(2023-24)	rak	Ms. Archan Kshirsagar	CCS	practical	1
Odd(2023-24)	rak	Ms. Archan Kshirsagar	SBL+PBL	practical	1
Odd(2023-24)	rak	Ms. Archan Kshirsagar	SBL-III	practical	6
Odd(2023-24)	rak	Ms. Archan Kshirsagar	TBL+PBL	practical	1
Unknown	Unknown	Ms. Ekta Pandit	DBMS	practical	2
Unknown	Unknown	Ms. Ekta Pandit	MC	practical	8
Unknown	Unknown	Ms. Ekta Pandit	PBL	practical	2
Unknown	Unknown	Ms. Ekta Pandit	WD	practical	2
Unknown	Unknown	Ms. Ekta Pandit	MC	theory	3
Unknown	Unknown	Ms. Meghana Patil	PBL	practical	4
Unknown	Unknown	Ms. Meghana Patil	PBL	practical	12
Unknown	Unknown	Ms. Meghana Patil	PBL	theory	1
Unknown	Unknown	Ms. Meghana Patil	PBL	theory	1
Even(2023-24)	Unknown	Ms. Pradnya V. Kamble	IOT	practical	1
Even(2023-24)	Unknown	Ms. Pradnya V. Kamble	LNSC (SBL-IX)	practical	4
Even(2023-24)	Unknown	Ms. Pradnya V. Kamble	IOT	theory	3
Even(2023-24)	Unknown	Ms. Pradnya V. Kamble	MAJOR PROJECT	theory	2
Odd(2023-24)	Unknown	Ms. Pradnya V. Kamble	MWE	practical	4
Odd(2023-24)	Unknown	Ms. Pradnya V. Kamble	MCS	theory	3
Odd(2023-24)	Unknown	Ms. Pradnya V. Kamble	MCS	theory	3
Odd(2023-24)	Unknown	Ms. Pradnya V. Kamble	PROJECT	theory	2
Odd(2024-25)	Unknown	Ms. Pradnya V. Kamble	MWE	practical	4
Odd(2024-25)	Unknown	Ms. Pradnya V. Kamble	MCS	theory	3
Odd(2024-25)	Unknown	Ms. Pradnya V. Kamble	MCS	theory	3
Odd(2024-25)	Unknown	Ms. Pradnya V. Kamble	PROJECT	theory	2
Unknown	Unknown	Ms. Pradnya V. Kamble	ICC	practical	4
Unknown	Unknown	Ms. Pradnya V. Kamble	IOT	practical	4
Unknown	Unknown	Ms. Pradnya V. Kamble	MWE	practical	4
Unknown	Unknown	Ms. Pradnya V. Kamble	PROJECT	practical	2
Unknown	Unknown	Ms. Pradnya V. Kamble	PROJECT	practical	2
Unknown	Unknown	Ms. Pradnya V. Kamble	SBL (LIN)	practical	8
Unknown	Unknown	Ms. Pradnya V. Kamble	ICC	theory	1
Unknown	Unknown	Ms. Pradnya V. Kamble	IOT	theory	3
Unknown	Unknown	Ms. Pradnya V. Kamble	MCS	theory	3
Unknown	Unknown	Ms. Pradnya V. Kamble	MCS	theory	3
Odd(2023-24)	pp	Ms. Prahelika Pai	BCE	practical	4
Odd(2023-24)	pp	Ms. Prahelika Pai	BCE(A)	theory	2
Even(2023-24)	prh	Ms. Pranali P. Hatode	PYP (SBL-V)	practical	4
Even(2023-24)	prh	Ms. Pranali P. Hatode	SAP	practical	1
Even(2023-24)	prh	Ms. Pranali P. Hatode	MAJOR PROJECT	theory	2
Even(2023-24)	prh	Ms. Pranali P. Hatode	SAP	theory	3
Odd(2023-24)	prh	Ms. Pranali P. Hatode	AIML	practical	4
Odd(2023-24)	prh	Ms. Pranali P. Hatode	CCS	practical	1
Odd(2023-24)	prh	Ms. Pranali P. Hatode	AIML	theory	4
Odd(2023-24)	prh	Ms. Pranali P. Hatode	PROJECT	theory	2
Odd(2024-25)	prh	Ms. Pranali P. Hatode	AIML	practical	3
Odd(2024-25)	prh	Ms. Pranali P. Hatode	DSA	practical	1
Odd(2024-25)	prh	Ms. Pranali P. Hatode	AIML	theory	4
Odd(2024-25)	prh	Ms. Pranali P. Hatode	PROJECT	theory	2
Odd(2024-25)	prh	Ms. Pranali P. Hatode	TBL+SBL	theory	2
Unknown	prh	Ms. Pranali P. Hatode	AIML (HONORS)	practical	6
Unknown	prh	Ms. Pranali P. Hatode	ML	practical	8
Unknown	prh	Ms. Pranali P. Hatode	NNDL	practical	4
Unknown	prh	Ms. Pranali P. Hatode	PROJECT	practical	2
Unknown	prh	Ms. Pranali P. Hatode	PROJECT	practical	2
Unknown	prh	Ms. Pranali P. Hatode	SBL (PY)	practical	4
Unknown	prh	Ms. Pranali P. Hatode	AIML (HONORS)	theory	2
Unknown	prh	Ms. Pranali P. Hatode	ML	theory	3
Unknown	prh	Ms. Pranali P. Hatode	NNDL	theory	3
Odd(2023-24)	Unknown	Ms. Priya A. Gupta	SBL+PBL	practical	1
Odd(2023-24)	Unknown	Ms. Priya A. Gupta	ST	practical	1
Odd(2023-24)	Unknown	Ms. Priya A. Gupta	TBL+PBL	practical	3
Odd(2023-24)	Unknown	Ms. Priya A. Gupta	ENT	theory	2
Odd(2023-24)	Unknown	Ms. Priya A. Gupta	ENT	theory	2
Odd(2023-24)	Unknown	Ms. Priya A. Gupta	ST	theory	3
Even(2023-24)	ra	Ms. Rashmi  R. Adatkar	MC	practical	4
Even(2023-24)	ra	Ms. Rashmi  R. Adatkar	MAJOR PROJECT	theory	2
Even(2023-24)	ra	Ms. Rashmi  R. Adatkar	MC	theory	3
Even(2023-24)	ra	Ms. Rashmi  R. Adatkar	MC	theory	3
Even(2025-26)	ra	Ms. Rashmi  R. Adatkar	MICROCONTROLLERS	practical	8
Even(2025-26)	ra	Ms. Rashmi  R. Adatkar	PROJECT	practical	2
Even(2025-26)	ra	Ms. Rashmi  R. Adatkar	MICROCONTROLLERS	theory	3
Even(2025-26)	ra	Ms. Rashmi  R. Adatkar	MICROCONTROLLERS	theory	3
Odd(2023-24)	ra	Ms. Rashmi  R. Adatkar	DSA	practical	3
Odd(2023-24)	ra	Ms. Rashmi  R. Adatkar	DSA	theory	6
Odd(2023-24)	ra	Ms. Rashmi  R. Adatkar	PROJECT	theory	2
Odd(2023-24)	ra	Ms. Rashmi  R. Adatkar	SBL - VII	theory	2
Odd(2024-25)	ra	Ms. Rashmi  R. Adatkar	DSA	practical	4
Odd(2024-25)	ra	Ms. Rashmi  R. Adatkar	DSA	theory	3
Odd(2024-25)	ra	Ms. Rashmi  R. Adatkar	DSA	theory	3
Odd(2024-25)	ra	Ms. Rashmi  R. Adatkar	PROJECT	theory	2
Unknown	ra	Ms. Rashmi  R. Adatkar	BDA	practical	2
Unknown	ra	Ms. Rashmi  R. Adatkar	DSA	practical	6
Unknown	ra	Ms. Rashmi  R. Adatkar	IPMV	practical	4
Unknown	ra	Ms. Rashmi  R. Adatkar	MC	practical	8
Unknown	ra	Ms. Rashmi  R. Adatkar	PROJECT	practical	2
Unknown	ra	Ms. Rashmi  R. Adatkar	PROJECT	practical	2
Unknown	ra	Ms. Rashmi  R. Adatkar	DSA	theory	3
Unknown	ra	Ms. Rashmi  R. Adatkar	DSA	theory	3
Unknown	ra	Ms. Rashmi  R. Adatkar	MC	theory	3
Odd(2023-24)	Unknown	Ms. Reshama J. Rasal	BDA	practical	4
Odd(2023-24)	Unknown	Ms. Reshama J. Rasal	SBL+PBL	practical	2
Odd(2023-24)	Unknown	Ms. Reshama J. Rasal	BDA	theory	3
Even(2023-24)	rk	Ms. Rupali S. Kadu	DBMS	practical	2
Even(2023-24)	rk	Ms. Rupali S. Kadu	LIC	practical	2
Even(2023-24)	rk	Ms. Rupali S. Kadu	DBMS	theory	3
Even(2023-24)	rk	Ms. Rupali S. Kadu	DBMS	theory	3
Even(2023-24)	rk	Ms. Rupali S. Kadu	MAJOR PROJECT	theory	2
Even(2025-26)	rk	Ms. Rupali S. Kadu	DBMS	practical	8
Even(2025-26)	rk	Ms. Rupali S. Kadu	PROJECT	practical	2
Even(2025-26)	rk	Ms. Rupali S. Kadu	DBMS	theory	3
Even(2025-26)	rk	Ms. Rupali S. Kadu	DBMS	theory	3
Odd(2023-24)	rk	Ms. Rupali S. Kadu	DTSP	practical	3
Odd(2023-24)	rk	Ms. Rupali S. Kadu	EICS	practical	2
Odd(2023-24)	rk	Ms. Rupali S. Kadu	DTSP	theory	3
Odd(2023-24)	rk	Ms. Rupali S. Kadu	PROJECT	theory	2
Odd(2023-24)	rk	Ms. Rupali S. Kadu	SBL - VII	theory	2
Odd(2024-25)	rk	Ms. Rupali S. Kadu	DTSP	practical	4
Odd(2024-25)	rk	Ms. Rupali S. Kadu	DTSP	theory	3
Odd(2024-25)	rk	Ms. Rupali S. Kadu	PROJECT	theory	2
Odd(2024-25)	rk	Ms. Rupali S. Kadu	T & P	theory	2
Odd(2024-25)	rk	Ms. Rupali S. Kadu	T & P	theory	2
Unknown	rk	Ms. Rupali S. Kadu	DBMS	practical	8
Unknown	rk	Ms. Rupali S. Kadu	DTSP	practical	8
Unknown	rk	Ms. Rupali S. Kadu	PROJECT	practical	2
Unknown	rk	Ms. Rupali S. Kadu	PROJECT	practical	2
Unknown	rk	Ms. Rupali S. Kadu	SAT-VII	practical	2
Unknown	rk	Ms. Rupali S. Kadu	DBMS (A)	theory	3
Unknown	rk	Ms. Rupali S. Kadu	DBMS (B)	theory	3
Unknown	rk	Ms. Rupali S. Kadu	DTSP	theory	3
Unknown	rk	Ms. Rupali S. Kadu	SBL-X	theory	2
Even(2023-24)	rs	Ms. Rupali V. Satpute	DBMS	practical	2
Even(2023-24)	rs	Ms. Rupali V. Satpute	PCE	practical	3
Even(2023-24)	rs	Ms. Rupali V. Satpute	MAJOR PROJECT	theory	2
Even(2023-24)	rs	Ms. Rupali V. Satpute	PCE	theory	3
Even(2025-26)	rs	Ms. Rupali V. Satpute	ANALOG & DIGITAL COMMUNICATION ENGINEERING	practical	8
Even(2025-26)	rs	Ms. Rupali V. Satpute	DBMS	practical	4
Even(2025-26)	rs	Ms. Rupali V. Satpute	PROJECT	practical	2
Even(2025-26)	rs	Ms. Rupali V. Satpute	ANALOG & DIGITAL COMMUNICATION ENGINEERING	theory	3
Odd(2023-24)	rs	Ms. Rupali V. Satpute	DCOM	practical	2
Odd(2023-24)	rs	Ms. Rupali V. Satpute	DSA	practical	2
Odd(2023-24)	rs	Ms. Rupali V. Satpute	DCOM	theory	3
Odd(2023-24)	rs	Ms. Rupali V. Satpute	DOCM	theory	3
Odd(2023-24)	rs	Ms. Rupali V. Satpute	PROJECT	theory	2
Odd(2024-25)	rs	Ms. Rupali V. Satpute	DCOM	practical	5
Odd(2024-25)	rs	Ms. Rupali V. Satpute	DCOM	theory	3
Odd(2024-25)	rs	Ms. Rupali V. Satpute	DCOM	theory	3
Odd(2024-25)	rs	Ms. Rupali V. Satpute	PROJECT	theory	2
Unknown	rs	Ms. Rupali V. Satpute	ADCOM	practical	8
Unknown	rs	Ms. Rupali V. Satpute	DSA	practical	8
Unknown	rs	Ms. Rupali V. Satpute	EMA	practical	2
Unknown	rs	Ms. Rupali V. Satpute	PBL	practical	2
Unknown	rs	Ms. Rupali V. Satpute	PROJECT	practical	2
Unknown	rs	Ms. Rupali V. Satpute	PROJECT	practical	2
Unknown	rs	Ms. Rupali V. Satpute	ADCOM	theory	3
Unknown	rs	Ms. Rupali V. Satpute	CCN	theory	3
Unknown	rs	Ms. Rupali V. Satpute	CCN	theory	3
Even(2023-24)	Unknown	Ms. Sandhya S. Deshpande	LNSC (SBL-IX)	practical	4
Even(2023-24)	Unknown	Ms. Sandhya S. Deshpande	CCN	theory	3
Even(2023-24)	Unknown	Ms. Sandhya S. Deshpande	CCN	theory	3
Even(2023-24)	Unknown	Ms. Sandhya S. Deshpande	MAJOR PROJECT	theory	2
Odd(2023-24)	Unknown	Ms. Sandhya S. Deshpande	SBL+PBL	practical	2
Odd(2023-24)	Unknown	Ms. Sandhya S. Deshpande	TBL+PBL	practical	4
Odd(2023-24)	Unknown	Ms. Sandhya S. Deshpande	PROJECT	theory	2
Odd(2024-25)	Unknown	Ms. Sandhya S. Deshpande	DLD	practical	5
Odd(2024-25)	Unknown	Ms. Sandhya S. Deshpande	ILOC	theory	3
Odd(2024-25)	Unknown	Ms. Sandhya S. Deshpande	PROJECT	theory	2
Odd(2024-25)	Unknown	Ms. Sandhya S. Deshpande	TBL+SBL	theory	1
Unknown	Unknown	Ms. Sandhya S. Deshpande	DLD	practical	10
Unknown	Unknown	Ms. Sandhya S. Deshpande	PBL-I	practical	2
Unknown	Unknown	Ms. Sandhya S. Deshpande	PROJECT	practical	2
Unknown	Unknown	Ms. Sandhya S. Deshpande	PROJECT	practical	2
Unknown	Unknown	Ms. Sandhya S. Deshpande	SBL	practical	4
Unknown	Unknown	Ms. Sandhya S. Deshpande	TBL	practical	4
Unknown	Unknown	Ms. Sandhya S. Deshpande	CSL(HONORS)	theory	2
Unknown	Unknown	Ms. Sandhya S. Deshpande	FM	theory	3
Unknown	Unknown	Ms. Sandhya S. Deshpande	FM(ILOC)	theory	3
Even(2023-24)	td	Ms. Tilottama P. Dhake	PCE	practical	3
Even(2023-24)	td	Ms. Tilottama P. Dhake	PYP (SBL-V)	practical	2
Even(2023-24)	td	Ms. Tilottama P. Dhake	MAJOR PROJECT	theory	2
Even(2023-24)	td	Ms. Tilottama P. Dhake	PCE	theory	3
Even(2025-26)	td	Ms. Tilottama P. Dhake	ANALOG & DIGITAL COMMUNICATION ENGINEERING	practical	8
Even(2025-26)	td	Ms. Tilottama P. Dhake	PROJECT	practical	2
Even(2025-26)	td	Ms. Tilottama P. Dhake	SKILL ENHANCEMENT(SAT-VIII): SKILL BASED LEARNING  (PYTHON PROGRAMMING)	practical	4
Even(2025-26)	td	Ms. Tilottama P. Dhake	ANALOG & DIGITAL COMMUNICATION ENGINEERING	theory	3
Odd(2023-24)	td	Ms. Tilottama P. Dhake	CCS	practical	4
Odd(2023-24)	td	Ms. Tilottama P. Dhake	CCS	theory	3
Odd(2023-24)	td	Ms. Tilottama P. Dhake	CCS	theory	3
Odd(2023-24)	td	Ms. Tilottama P. Dhake	PROJECT	theory	2
Odd(2024-25)	td	Ms. Tilottama P. Dhake	CCS	practical	4
Odd(2024-25)	td	Ms. Tilottama P. Dhake	DCOM	practical	1
Odd(2024-25)	td	Ms. Tilottama P. Dhake	CCS	theory	3
Odd(2024-25)	td	Ms. Tilottama P. Dhake	PROJECT	theory	2
Odd(2024-25)	td	Ms. Tilottama P. Dhake	TBL+SBL	theory	2
Unknown	td	Ms. Tilottama P. Dhake	ADCOM	practical	8
Unknown	td	Ms. Tilottama P. Dhake	CCS	practical	6
Unknown	td	Ms. Tilottama P. Dhake	EMA	practical	2
Unknown	td	Ms. Tilottama P. Dhake	PBL-I	practical	6
Unknown	td	Ms. Tilottama P. Dhake	PROJECT	practical	2
Unknown	td	Ms. Tilottama P. Dhake	PROJECT	practical	2
Unknown	td	Ms. Tilottama P. Dhake	SBL (PYP)	practical	2
Unknown	td	Ms. Tilottama P. Dhake	ADCOM	theory	3
Unknown	td	Ms. Tilottama P. Dhake	CCS	theory	3
Even(2023-24)	Unknown	Ms. Vandana Salve	ML	practical	3
Even(2023-24)	vc	Ms. Vricha S. Chavan	IPMV	practical	1
Even(2023-24)	vc	Ms. Vricha S. Chavan	NLP	practical	4
Even(2023-24)	vc	Ms. Vricha S. Chavan	MAJOR PROJECT	theory	2
Even(2023-24)	vc	Ms. Vricha S. Chavan	NLP	theory	3
Even(2025-26)	vc	Ms. Vricha S. Chavan	FDS	practical	6
Even(2025-26)	vc	Ms. Vricha S. Chavan	NLP	practical	2
Even(2025-26)	vc	Ms. Vricha S. Chavan	PROJECT	practical	2
Even(2025-26)	vc	Ms. Vricha S. Chavan	MIS	theory	3
Even(2025-26)	vc	Ms. Vricha S. Chavan	NLP	theory	3
Odd(2023-24)	vc	Ms. Vricha S. Chavan	DCOM	practical	6
Odd(2023-24)	vc	Ms. Vricha S. Chavan	MIS	theory	3
Odd(2023-24)	vc	Ms. Vricha S. Chavan	PROJECT	theory	2
Odd(2024-25)	vc	Ms. Vricha S. Chavan	DCOM	practical	2
Odd(2024-25)	vc	Ms. Vricha S. Chavan	EICS	practical	3
Odd(2024-25)	vc	Ms. Vricha S. Chavan	MIS	theory	3
Odd(2024-25)	vc	Ms. Vricha S. Chavan	PROJECT	theory	2
Odd(2024-25)	vc	Ms. Vricha S. Chavan	TBL+SBL	theory	1
Unknown	vc	Ms. Vricha S. Chavan	EICS	practical	8
Unknown	vc	Ms. Vricha S. Chavan	FDS	practical	8
Unknown	vc	Ms. Vricha S. Chavan	IPMV	practical	2
Unknown	vc	Ms. Vricha S. Chavan	PBL-I	practical	2
Unknown	vc	Ms. Vricha S. Chavan	PROJECT	practical	2
Unknown	vc	Ms. Vricha S. Chavan	PROJECT	practical	2
Unknown	vc	Ms. Vricha S. Chavan	MIS	theory	3
Unknown	vc	Ms. Vricha S. Chavan	PM (ILOC)	theory	3
Even(2023-24)	ss	Ms.Swati H. Shinde	OFC	practical	4
Even(2023-24)	ss	Ms.Swati H. Shinde	MAJOR PROJECT	theory	2
Even(2023-24)	ss	Ms.Swati H. Shinde	OFC	theory	3
Even(2023-24)	ss	Ms.Swati H. Shinde	OFC	theory	3
Even(2025-26)	ss	Ms.Swati H. Shinde	OCN	practical	8
Even(2025-26)	ss	Ms.Swati H. Shinde	PROJECT	practical	2
Even(2025-26)	ss	Ms.Swati H. Shinde	OCN	theory	3
Even(2025-26)	ss	Ms.Swati H. Shinde	OCN	theory	3
Odd(2023-24)	ss	Ms.Swati H. Shinde	DVD	practical	4
Odd(2023-24)	ss	Ms.Swati H. Shinde	ESR	practical	1
Odd(2023-24)	ss	Ms.Swati H. Shinde	ESR	theory	3
Odd(2023-24)	ss	Ms.Swati H. Shinde	PROJECT	theory	2
Odd(2024-25)	ss	Ms.Swati H. Shinde	ESR	practical	1
Odd(2024-25)	ss	Ms.Swati H. Shinde	VLSI	practical	5
Odd(2024-25)	ss	Ms.Swati H. Shinde	ESR	theory	3
Odd(2024-25)	ss	Ms.Swati H. Shinde	PROJECT	theory	2
Unknown	ss	Ms.Swati H. Shinde	ESR	practical	4
Unknown	ss	Ms.Swati H. Shinde	OCN	practical	6
Unknown	ss	Ms.Swati H. Shinde	PBL-II	practical	6
Unknown	ss	Ms.Swati H. Shinde	PROJECT	practical	2
Unknown	ss	Ms.Swati H. Shinde	PROJECT	practical	2
Unknown	ss	Ms.Swati H. Shinde	ESR	theory	3
Unknown	ss	Ms.Swati H. Shinde	OCN	theory	3
Unknown	ss	Ms.Swati H. Shinde	OCN	theory	3
Unknown	ss	Ms.Swati H. Shinde	PBL-II	theory	1
Unknown	ss	Ms.Swati H. Shinde	PBL-II	theory	1
\.


-- Completed on 2026-05-02 18:39:08

--
-- PostgreSQL database dump complete
--

\unrestrict lhUE06aeAvTaFPud3MY9wZUma4ynZYzw97vy9pgDU1wWF3S5x5lJPYHI9pcHBCE

