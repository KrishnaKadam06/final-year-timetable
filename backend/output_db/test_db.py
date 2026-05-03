import psycopg2
import traceback

try:
    conn = psycopg2.connect("postgresql://postgres:superuserbitch@localhost:5432/university_timetable")
    print("SUCCESS")
except Exception as e:
    print("FAILED")
    traceback.print_exc()
