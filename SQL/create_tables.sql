CREATE DATABASE CheeseDiary;

-- Users
USE CheeseDiary;
CREATE TABLE Users (
  UserID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(320) NOT NULL,
  DisplayName VARCHAR(20) NOT NULL,
  TimeCreated TIMESTAMP NOT NULL,
  IsAdmin BOOLEAN NOT NULL,
  UNIQUE(EMAIL),
  PRIMARY KEY (UserID)
);

-- Cheeses
CREATE TABLE Cheeses (
  CheeseID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  PRIMARY KEY (CheeseID)
);

-- Tags
CREATE TABLE Tags (
  TagID INT NOT NULL AUTO_INCREMENT,
  Tag VARCHAR(30) NOT NULL,
  UNIQUE(Tag),
  PRIMARY KEY (TagID)
);

-- Cheesemakers
CREATE TABLE Cheesemakers (
  CheesemakerID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Location VARCHAR(100) NOT NULL,
  PRIMARY KEY (CheesemakerID)
);

-- Cheeses / Cheesemakers
CREATE TABLE CheeseCheesemaker (
  CheeseID INT NOT NULL,
  CheesemakerID INT NOT NULL,
  PRIMARY KEY (CheeseID, CheesemakerID),
  FOREIGN KEY (CheeseID) REFERENCES Cheeses(CheeseID),
  FOREIGN KEY (CheesemakerID) REFERENCES Cheesemakers(CheesemakerID)
);

-- Cheeseshops
CREATE TABLE Cheeseshops (
  CheeseshopID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Street VARCHAR(100) NOT NULL,
  ZipCode MEDIUMINT (5) UNSIGNED ZEROFILL,
  City VARCHAR(100) NOT NULL,
  State VARCHAR(100),
  Country VARCHAR(100) NOT NULL,
  Phone VARCHAR(22),
  PRIMARY KEY (CheeseshopID)
);

-- Reviews
CREATE TABLE Reviews (
  ReviewID INT NOT NULL AUTO_INCREMENT,
  Photo VARCHAR(512), -- url to storage
  Rating INT,
  TastingNotes VARCHAR(500),
  PRIMARY KEY (ReviewID)
);

-- Reviews / Users
CREATE TABLE ReviewUser (
  UserID INT NOT NULL,
  ReviewID INT NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (ReviewID) REFERENCES Reviews(ReviewID),
  PRIMARY KEY (UserID, ReviewID)
);

-- Reviews / Cheeses / Cheeseshops
CREATE TABLE CheeseReview (
  CheeseID INT NOT NULL,
  ReviewID INT NOT NULL,
  FOREIGN KEY (CheeseID) REFERENCES Cheeses(CheeseID),
  FOREIGN KEY (ReviewID) REFERENCES Reviews(ReviewID),
  PRIMARY KEY (CheeseID, ReviewID)
);

-- Reviews / Cheeseshop
CREATE TABLE CheeseshopReview (
  CheeseshopID INT NOT NULL,
  ReviewID INT NOT NULL,
  PricePerLb DECIMAL(11,2),
  FOREIGN KEY (CheeseshopID) REFERENCES Cheeseshops(CheeseshopID),
  FOREIGN KEY (ReviewID) REFERENCES Reviews(ReviewID),
  PRIMARY KEY (CheeseshopID, ReviewID)
);

-- Review/Tags
CREATE TABLE TagReview (
  TagID INT NOT NULL,
  ReviewID INT NOT NULL,
  FOREIGN KEY (TagID) REFERENCES Tags(TagID),
  FOREIGN KEY (ReviewID) REFERENCES Reviews(ReviewID),
  PRIMARY KEY (TagID, ReviewID)
);
