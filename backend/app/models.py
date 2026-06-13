from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Faculty(Base):
    __tablename__ = "faculty"
    faculty_id = Column(Integer, primary_key=True, index=True)
    faculty_initials = Column(String(20), unique=True, index=True)
    faculty_name = Column(String(200))
    department_id = Column(Integer)
    is_active = Column(Boolean, default=True)

class Room(Base):
    __tablename__ = "rooms"
    room_id = Column(Integer, primary_key=True, index=True)
    room_code = Column(String(50), unique=True, index=True)
    room_name = Column(String(100))
    room_type = Column(String(20)) # 'theory' or 'lab'

class Subject(Base):
    __tablename__ = "subjects"
    subject_id = Column(Integer, primary_key=True, index=True)
    subject_code = Column(String(20), unique=True, index=True)
    subject_name = Column(String(200))

class Batch(Base):
    __tablename__ = "batches"
    batch_id = Column(Integer, primary_key=True, index=True)
    batch_name = Column(String(20), unique=True, index=True)

class SubjectFacultyAssignment(Base):
    __tablename__ = "subject_faculty_assignments"
    assignment_id = Column(Integer, primary_key=True, index=True)
    subject_code = Column(String(20))   
    faculty_initials = Column(String(20))
    batch_name = Column(String(20))
    room_code = Column(String(50))
    assignment_type = Column(String(20)) # 'theory' or 'practical'
    hours_per_week = Column(Integer)