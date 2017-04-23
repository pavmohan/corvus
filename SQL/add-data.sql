-- *****************************************************************************
-- Add Users
INSERT INTO Users (Name, Email, DisplayName, TimeCreated, IsAdmin) values
("Erin Donnelly", "edonn22@gmail.com", "Erin", CURRENT_TIMESTAMP, false);

INSERT INTO Users (Name, Email, DisplayName, TimeCreated, IsAdmin) values
("Erin Krengel", "erin.c.krengel@gmail.com", "EKrengel", CURRENT_TIMESTAMP, true);

INSERT INTO Users (Name, Email, DisplayName, TimeCreated, IsAdmin) values
("Lauren Crees", "creesl@oregonstate.edu", "Lauren", CURRENT_TIMESTAMP, false);

INSERT INTO Users (Name, Email, DisplayName, TimeCreated, IsAdmin) values
("Pavallan Mohan", "mohanp@oregonstate.edu", "Val", CURRENT_TIMESTAMP, false);

-- *****************************************************************************
-- Add Cheeses
INSERT INTO Cheeses (Name) values ("Flagship");
INSERT INTO Cheeses (Name) values ("Flagship Reserve");
INSERT INTO Cheeses (Name) values ("Beecher's Curds");
INSERT INTO Cheeses (Name) values ("Marco Polo");
INSERT INTO Cheeses (Name) values ("No Woman");
INSERT INTO Cheeses (Name) values ("Trufflestack");
INSERT INTO Cheeses (Name) values ("Seastack");

-- *****************************************************************************
-- Add Tags
INSERT INTO Tags (Tag) values ("Smokey");
INSERT INTO Tags (Tag) values ("Fruity");
INSERT INTO Tags (Tag) values ("Buttery");
INSERT INTO Tags (Tag) values ("Chalky");
INSERT INTO Tags (Tag) values ("Floral");
INSERT INTO Tags (Tag) values ("Brothy");

-- *****************************************************************************
-- Add Cheesemakers
INSERT INTO Cheesemakers (Name, Location) values ("Beecher's", "Seattle, WA");
INSERT INTO Cheesemakers (Name, Location) values ("Mt. Townsend Creamery", "Port Townsend, WA");


-- *****************************************************************************
-- Add CheeseCheesemaker
INSERT INTO CheeseCheesemaker (CheeseID, CheesemakerID) values (1, 1);
INSERT INTO CheeseCheesemaker (CheeseID, CheesemakerID) values (2, 1);
INSERT INTO CheeseCheesemaker (CheeseID, CheesemakerID) values (3, 1);
INSERT INTO CheeseCheesemaker (CheeseID, CheesemakerID) values (4, 1);
INSERT INTO CheeseCheesemaker (CheeseID, CheesemakerID) values (5, 1);
INSERT INTO CheeseCheesemaker (CheeseID, CheesemakerID) values (6, 2);
INSERT INTO CheeseCheesemaker (CheeseID, CheesemakerID) values (7, 2);


-- *****************************************************************************
-- Add Cheeseshops
INSERT INTO Cheeseshops (Name, Street, ZipCode, City, State, Country, Phone) values
("The Cheeseshop", "Carmel Plaza, Junipero St", "93921", "Carmel-By-The-Sea", "CA", "USA", "(831) 625-2272");
INSERT INTO Cheeseshops (Name, Street, ZipCode, City, State, Country, Phone) values
("DeLaurenti", "1435 1st Ave", "98101", "Seattle", "WA", "USA", "(206) 622-0141");
INSERT INTO Cheeseshops (Name, Street, ZipCode, City, State, Country, Phone) values
("Kurt Farm Shop", "1424 11th Ave", "98122", "Seattle", "WA", "USA", "(206) 555-9999");

-- *****************************************************************************
-- Add Reviews
INSERT INTO Reviews (TastingNotes, Photo, Rating) values
("Very Delicious!", "http://www.cheese.com/media/img/cheese/Beechers_Flagship.jpg", 5);

-- *****************************************************************************
-- Add ReviewUser
INSERT INTO ReviewUser (ReviewID, UserID) values (1, 1);

-- *****************************************************************************
-- Add CheeseReview
INSERT INTO CheeseReview (ReviewID, CheeseID) values (1, 1);

-- *****************************************************************************
-- Add CheeseshopReview
INSERT INTO CheeseshopReview (CheeseshopID, ReviewID, PricePerLb) values ();

-- *****************************************************************************
-- Add TagReview
INSERT INTO TagReview (ReviewID, TagID) value (1, 3);
