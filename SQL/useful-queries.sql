SELECT * FROM Users;                -- All users
SELECT * FROM Cheeses;              -- All Cheeses
SELECT * FROM Tags;                 -- All tags
SELECT * FROM Cheesemakers;         -- All Cheesemakers
SELECT * FROM CheeseCheesemaker;    -- All CheeseCheesemaker
SELECT * FROM Cheeseshops;          -- All Cheeseshops
SELECT * FROM Reviews;              -- All Reviews
SELECT * FROM ReviewUser;           -- All Reviews / Users
SELECT * FROM CheeseReview;         -- All Reviews / Cheeses
SELECT * FROM CheeseshopReview;     -- All Reviews / Cheeseshop
SELECT * FROM TagReview;            -- All Review/Tags

-- ****************************************************************************
-- All Reviews belonging to a User
SELECT r.ReviewID, r.Photo, r.TastingNotes, r.Rating FROM Reviews r
INNER JOIN ReviewUser ru ON r.ReviewID = ru.ReviewID
WHERE ru.UserID = 1;

-- All regular users
SELECT * FROM Users WHERE IsAdmin = false;

-- All admin users
SELECT * FROM Users WHERE IsAdmin = true;

-- All cheeses at a Cheeseshop TODO: may want to add average price or average rating
SELECT  c.Name as Cheese, CheeseshopReview.PricePerLb FROM Cheeseshops
INNER JOIN CheeseshopReview ON Cheeseshops.CheeseshopID = CheeseshopReview.CheeseshopID
INNER JOIN CheeseReview ON CheeseReview.ReviewID = CheeseshopReview.ReviewID
INNER JOIN Cheeses c ON CheeseReview.CheeseID = c.CheeseID
WHERE Cheeseshops.CheeseshopID = 1;

-- All cheeses from a Cheesemaker
SELECT c.CheeseID, c.Name FROM Cheeses c
INNER JOIN CheeseCheesemaker cc ON c.CheeseID = cc.CheeseID
WHERE cc.CheesemakerID = 2;

-- All cheeseshops that sell a particular cheese
SELECT Cheeseshops.Name AS Cheeseshop, Cheeseshops.ZipCode, CheeseshopReview.PricePerLb FROM CheeseReview
INNER JOIN CheeseshopReview ON CheeseReview.ReviewID = CheeseshopReview.ReviewID
INNER JOIN Cheeses ON Cheeses.CheeseID = CheeseReview.CheeseID
INNER JOIN Cheeseshops ON CheeseshopReview.CheeseshopID = Cheeseshops.CheeseshopID
WHERE Cheeses.CheeseID = 1;

-- All cheeses at a particular cheeseshop
SELECT Cheeses.Name, CheeseshopReview.PricePerLb FROM CheeseReview
INNER JOIN CheeseshopReview ON CheeseReview.ReviewID = CheeseshopReview.ReviewID
INNER JOIN Cheeses ON Cheeses.CheeseID = CheeseReview.CheeseID
WHERE CheeseshopReview.CheeseshopID = 1;

-- Top cheeses TODO

-- A complete review TODO

-- All tags for a cheese TODO
