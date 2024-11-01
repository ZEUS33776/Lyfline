# ml-service/train_and_save_models.py
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
import joblib

def train_and_save_heart_model():
    # Load and prepare data
    df = pd.read_csv('datasets/heart.csv')
    X = df.iloc[:,:-1].values
    y = df.iloc[:,-1].values
    
    # Handle missing values
    imputer = SimpleImputer(missing_values=np.nan, strategy='mean')
    X = imputer.fit_transform(X)
    
    # Split data
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
    
    # Scale features
    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)
    
    # Train model
    classifier = RandomForestClassifier(n_estimators=1, criterion='entropy', random_state=0)
    classifier.fit(X_train, y_train)
    
    # Save model and preprocessors
    joblib.dump(classifier, 'models/heart_model.joblib')
    joblib.dump(sc, 'models/heart_scaler.joblib')
    joblib.dump(imputer, 'models/heart_imputer.joblib')
    
    print("Heart disease model, scaler, and imputer saved successfully!")

def train_and_save_chd_model():
    # Load and prepare data
    df = pd.read_csv('datasets/framingham.csv')
    X = df.iloc[:,[0,1,2,3,4,5,6,7,8,10,11,12,13]].values
    y = df.iloc[:,-1].values
    
    # Handle missing values
    imputer = SimpleImputer(missing_values=np.nan, strategy='mean')
    X = imputer.fit_transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=1)
    
    # Scale features
    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)
    
    # Train model
    classifier = RandomForestClassifier(n_estimators=56, criterion='entropy', random_state=0)
    classifier.fit(X_train, y_train)
    
    # Save model and preprocessors
    joblib.dump(classifier, 'models/chd_model.joblib')
    joblib.dump(sc, 'models/chd_scaler.joblib')
    joblib.dump(imputer, 'models/chd_imputer.joblib')
    
    print("10-year CHD model, scaler, and imputer saved successfully!")

if __name__ == "__main__":
    train_and_save_heart_model()
    train_and_save_chd_model()