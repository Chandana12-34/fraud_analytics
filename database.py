from sqlalchemy import create_engine, Column, Integer, String, Numeric, Boolean, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+psycopg2://postgres:fraud_pass@localhost:5432/fraud_detection"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"
    TransactionID = Column(String, primary_key=True, index=True)
    Amount = Column(Numeric)
    CustomerID = Column(String)
    Category = Column(String)
    AnomalyScore = Column(Numeric)
    TransactionAmount = Column(Numeric)
    AccountBalance = Column(Numeric)
    LastLogin = Column(TIMESTAMP)
    Name = Column(String)
    Age = Column(Integer)
    Address = Column(String)
    Timestamp = Column(TIMESTAMP)
    MerchantID = Column(String)
    FraudIndicator = Column(Boolean)
    SuspiciousFlag = Column(Boolean)
