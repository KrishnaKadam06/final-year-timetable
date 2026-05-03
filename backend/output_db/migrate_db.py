import pandas as pd
import sqlite3
from sqlalchemy import create_engine

def migrate_to_postgres():
    # 1. Connect to your existing SQLite database
    sqlite_conn = sqlite3.connect(r'C:\Users\Savir\OneDrive\Desktop\Semwise\SEM 6\final year project material\university_timetable.db')
    
    # 2. Setup the PostgreSQL connection via SQLAlchemy
    # Format: postgresql://username:password@localhost:5432/database_name
    pg_engine = create_engine('postgresql://postgres:superuserbitch@localhost:5432/university_timetable')
    
    # 3. Define the tables from your dimensional model
    tables_to_migrate = ['dim_days', 'dim_slots', 'dim_faculty', 'fact_workload']
    
    # 4. Loop through and migrate each table
    for table in tables_to_migrate:
        print(f"Migrating {table}...")
        try:
            # Read the table from SQLite into a pandas DataFrame
            df = pd.read_sql(f"SELECT * FROM {table}", sqlite_conn)
            
            # Push the DataFrame directly into PostgreSQL
            # if_exists='replace' will create the table if it doesn't exist
            df.to_sql(table, pg_engine, if_exists='replace', index=False)
            print(f"Successfully migrated {len(df)} rows to {table}.")
        except Exception as e:
            print(f"Error migrating {table}: {e}")
            
    print("\nMigration Complete!")

if __name__ == "__main__":
    migrate_to_postgres()