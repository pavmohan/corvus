import datetime
import urllib
import wsgiref.handlers
import json
from google.appengine.ext import ndb
import webapp2




class Cheese(ndb.Model):
  Id=ndb.StringProperty()
  Name=ndb.StringProperty()
  MakerID=ndb.StringProperty()
 
class CheeseShop(ndb.Model):
  Id=ndb.StringProperty()
  Name=ndb.StringProperty()
  Phone=ndb.StringProperty()
  Street=ndb.StringProperty()
  City=ndb.StringProperty()
  State=ndb.StringProperty()
  Country=ndb.StringProperty()
  ZipCode=ndb.StringProperty()

class CheeseMaker(ndb.Model):
  Id=ndb.StringProperty()
  Name=ndb.StringProperty()
  Location=ndb.StringProperty()

class User(ndb.Model):
  Id=ndb.StringProperty()
  Name=ndb.StringProperty()
  DisplayName=ndb.StringProperty()
  Email=ndb.StringProperty()
  TimeCreated=ndb.StringProperty()
  IsAdmin=ndb.BooleanProperty()  

class Review(ndb.Model):
  Id=ndb.StringProperty()
  PricePerPound=ndb.IntegerProperty()
  TastingNotes=ndb.StringProperty()
  Rating=ndb.IntegerProperty()
  Photo=ndb.StringProperty()
  UserID=ndb.StringProperty()
  CheeseID=ndb.StringProperty()
  ShopID=ndb.StringProperty() 

class c1(webapp2.RequestHandler):
  def get(self):
    cheeseList = Cheese.query(); 
    dictList = []; 
    for obj in cheeseList:
      dTemp=obj.to_dict()
      mKey=ndb.Key(urlsafe=obj.MakerID)
      mTemp=mKey.get()
      dTemp['MakerName'] = mTemp.Name;
      dictList.append(dTemp)
    self.response.status=200;
    self.response.out.write(json.dumps(dictList));


class s1(webapp2.RequestHandler):
  def get(self):
    cheeseShopList = CheeseShop.query(); 
    dictList = []; 
    for obj in cheeseShopList:
      dictList.append(obj.to_dict())
    self.response.status=200;
    self.response.out.write(json.dumps(dictList));


class m1(webapp2.RequestHandler):
  def get(self):
    cheeseMakerList = CheeseMaker.query(); 
    dictList = []; 
    for obj in cheeseMakerList:
      dictList.append(obj.to_dict())
    self.response.status=200;
    self.response.out.write(json.dumps(dictList));


class u1(webapp2.RequestHandler):
  def get(self):
    userList = User.query(); 
    dictList = []; 
    for obj in userList:
      dictList.append(obj.to_dict())
    self.response.status=201;
    self.response.content_type = "text/plain"
    self.response.out.write(json.dumps(dictList));






class c2(webapp2.RequestHandler):
  def get(self, cID=None):
    if cID:
      cKey = ndb.Key(urlsafe=cID)
      tempCheese = cKey.get()
      dTemp=tempCheese.to_dict()
      mKey=ndb.Key(urlsafe=tempCheese.MakerID)
      mTemp=mKey.get()
      dTemp['MakerName'] = mTemp.Name;
      self.response.status=200;
      self.response.out.write(json.dumps(dTemp))


class m2(webapp2.RequestHandler):
  def get(self, mID=None):
    if mID:
      mKey = ndb.Key(urlsafe=mID)
      tempCheeseMaker = mKey.get()
      self.response.out.write(json.dumps(tempCheeseMaker.to_dict()))


class s2(webapp2.RequestHandler):
  def get(self, sID=None):
    if sID:
      sKey = ndb.Key(urlsafe=sID)
      tempCheeseShop = sKey.get()
      self.response.out.write(json.dumps(tempCheeseShop.to_dict()))

class u2(webapp2.RequestHandler):
  def get(self, uID=None):
    if uID:
      uKey = ndb.Key(urlsafe=uID)
      tempUser = uKey.get()
      self.response.out.write(json.dumps(tempUser.to_dict()))


class r2(webapp2.RequestHandler):
  def get(self, rID=None):
    if rID:
      rKey = ndb.Key(urlsafe=rID)
      obj = rKey.get()
      dTemp=obj.to_dict()
      
      sKey=ndb.Key(urlsafe=obj.ShopID)
      sTemp=sKey.get()
      dTemp['ShopName'] = sTemp.Name;

      cKey=ndb.Key(urlsafe=obj.CheeseID)
      cTemp=cKey.get()
      dTemp['CheeseName'] = cTemp.Name;

      uKey=ndb.Key(urlsafe=obj.UserID)
      uTemp=uKey.get()
      dTemp['UserName'] = uTemp.DisplayName;

      self.response.out.write(json.dumps(dTemp))



      
class c3(webapp2.RequestHandler):
  def post(self): 
    newCheese = json.loads(self.request.body)
    cheeseObj = Cheese();
    cheeseObj.Name=newCheese['Name']
    cheeseObj.MakerID=newCheese['MakerID']
    cKey=cheeseObj.put()
    cheeseObj.Id = cKey.urlsafe()
    cheeseObj.put()
    dTemp = cheeseObj.to_dict()
    mKey=ndb.Key(urlsafe=cheeseObj.MakerID)
    mTemp=mKey.get()
    dTemp['MakerName'] = mTemp.Name;

    self.response.write(json.dumps(dTemp))
      
class s3(webapp2.RequestHandler):
  def post(self): 
    newCheeseShop = json.loads(self.request.body)
    cheeseShopObj = CheeseShop();
    cheeseShopObj.Name=newCheeseShop['Name']
    cheeseShopObj.Phone=newCheeseShop['Phone']
    cheeseShopObj.Street=newCheeseShop['Street']
    cheeseShopObj.City=newCheeseShop['City']
    cheeseShopObj.State=newCheeseShop['State']
    cheeseShopObj.Country=newCheeseShop['Country']
    cheeseShopObj.ZipCode=newCheeseShop['ZipCode']
    sKey=cheeseShopObj.put()
    cheeseShopObj.Id = sKey.urlsafe()
    cheeseShopObj.put()
    self.response.write(json.dumps(cheeseShopObj.to_dict()))

      
class m3(webapp2.RequestHandler):
  def post(self): 
    newCheeseMaker = json.loads(self.request.body)
    cheeseMakerObj = CheeseMaker();
    cheeseMakerObj.Name=newCheeseMaker['Name']
    cheeseMakerObj.Location=newCheeseMaker['Location']
    mKey=cheeseMakerObj.put()
    cheeseMakerObj.Id = mKey.urlsafe()
    cheeseMakerObj.put()
    self.response.write(json.dumps(cheeseMakerObj.to_dict()))


      
class u3(webapp2.RequestHandler):
  def post(self): 
    newUser = json.loads(self.request.body)
    UserObj = User();
    UserObj.Name=newUser['Name']
    UserObj.DisplayName=newUser['DisplayName']
    UserObj.Email=newUser['Email']
    UserObj.TimeCreated=newUser['TimeCreated']
    UserObj.IsAdmin=newUser['IsAdmin']
    uKey=UserObj.put()
    UserObj.Id = uKey.urlsafe()
    UserObj.put()
    self.response.write(json.dumps(UserObj.to_dict()))


      
class r3(webapp2.RequestHandler):
  def post(self): 
    newRev = json.loads(self.request.body)
    revObj = Review();
    revObj.Rating=newRev['Rating']
    revObj.PricePerPound=newRev['PricePerPound']   
    revObj.TastingNotes=newRev['TastingNotes']
    revObj.Photo=newRev['Photo']
    revObj.CheeseID=newRev['CheeseID']
    revObj.ShopID=newRev['ShopID']
    revObj.UserID=newRev['UserID']
    rKey=revObj.put()
    revObj.Id = rKey.urlsafe()
    revObj.put()

    dTemp = revObj.to_dict();
    sKey=ndb.Key(urlsafe=revObj.ShopID)
    sTemp=sKey.get()
    dTemp['ShopName'] = sTemp.Name;

    cKey=ndb.Key(urlsafe=revObj.CheeseID)
    cTemp=cKey.get()
    dTemp['CheeseName'] = cTemp.Name;

    uKey=ndb.Key(urlsafe=revObj.UserID)
    uTemp=uKey.get()
    dTemp['UserName'] = uTemp.DisplayName;

    self.response.write(json.dumps(dTemp))



class c4(webapp2.RequestHandler):
  def put(self,cID=None):
    if cID:
      newCheese = json.loads(self.request.body);
      cKey = ndb.Key(urlsafe=cID);
      tempCheese = cKey.get()
      if newCheese.has_key('Name'):
        tempCheese.Name = newCheese['Name']
      if newCheese.has_key('MakerID'):
        tempCheese.MakerID = newCheese['MakerID']
      tempCheese.put()
      self.response.out.write(json.dumps(tempCheese.to_dict()))

class m4(webapp2.RequestHandler):
  def put(self,mID=None):
    if mID:
      newCheeseMaker = json.loads(self.request.body);
      mKey = ndb.Key(urlsafe=mID);
      tempCheeseMaker = mKey.get()
      if newCheeseMaker.has_key('Name'):
        tempCheeseMaker.Name = newCheeseMaker['Name']
      if newCheeseMaker.has_key('Location'):
        tempCheeseMaker.Location = newCheeseMaker['Location']
      tempCheeseMaker.put()
      self.response.out.write(json.dumps(tempCheeseMaker.to_dict()))


class s4(webapp2.RequestHandler):
  def put(self,sID=None):
    if sID:
      newCheeseShop = json.loads(self.request.body);
      sKey = ndb.Key(urlsafe=sID);
      tempCheeseShop = sKey.get()
      if newCheeseShop.has_key('Name'):
        tempCheeseShop.Name = newCheeseShop['Name']
      if newCheeseShop.has_key('Street'):
        tempCheeseShop.Street = newCheeseShop['Street']
      if newCheeseShop.has_key('City'):
        tempCheeseShop.City = newCheeseShop['City']
      if newCheeseShop.has_key('State'):
        tempCheeseShop.State = newCheeseShop['State']
      if newCheeseShop.has_key('ZipCode'):
        tempCheeseShop.ZipCode = newCheeseShop['ZipCode']
      if newCheeseShop.has_key('Phone'):
        tempCheeseShop.Phone = newCheeseShop['Phone']
      tempCheeseShop.put()
      self.response.out.write(json.dumps(tempCheeseShop.to_dict()))

class u4(webapp2.RequestHandler):
  def put(self,uID=None):
    if uID:
      newUser = json.loads(self.request.body);
      uKey = ndb.Key(urlsafe=uID);
      tempUser = uKey.get()
      if newUser.has_key('Name'):
        tempUser.Name = newUser['Name']
      if newUser.has_key('DisplayName'):
        tempUser.DisplayName = newUser['DisplayName']
      if newUser.has_key('TimeCreated'):
        tempUser.TimeCreated = newUser['TimeCreated']
      if newUser.has_key('Email'):
        tempUser.Email = newUser['Email']
      if newUser.has_key('IsAdmin'):
        tempUser.IsAdmin = newUser['IsAdmin']
      tempUser.put()
      self.response.out.write(json.dumps(tempUser.to_dict()))


class r4(webapp2.RequestHandler):
  def put(self,rID=None):
    if rID:
      newRev = json.loads(self.request.body);
      rKey = ndb.Key(urlsafe=rID);
      tempRev = rKey.get()
      if newRev.has_key('Rating'):
        tempRev.Rating = newRev['Rating']
      if newRev.has_key('PricePerPound'):
        tempRev.PricePerPound = newRev['PricePerPound']
      if newRev.has_key('TastingNotes'):
        tempRev.TastingNotes = newRev['TastingNotes']
      if newRev.has_key('Photo'):
        tempRev.Photo = newRev['Photo']
      if newRev.has_key('CheeseID'):
        tempRev.CheeseID = newRev['CheeseID']
      if newRev.has_key('ShopID'):
        tempRev.ShopID = newRev['ShopID']
      if newRev.has_key('UserID'):
        tempRev.UserID = newRev['UserID']
      tempRev.put()
      self.response.out.write(json.dumps(tempRev.to_dict()))



class c5(webapp2.RequestHandler):
  def get(self, cID=None):
    if cID:
      revList= Review.query()
      dictList = []; 
      for obj in revList:
        if obj.CheeseID == cID:
	  dTemp =obj.to_dict();
          sKey=ndb.Key(urlsafe=obj.ShopID)
          sTemp=sKey.get()
          dTemp['ShopName'] = sTemp.Name;

          cKey=ndb.Key(urlsafe=obj.CheeseID)
          cTemp=cKey.get()
          dTemp['CheeseName'] = cTemp.Name;

          uKey=ndb.Key(urlsafe=obj.UserID)
          uTemp=uKey.get()
          dTemp['UserName'] = uTemp.DisplayName;                    
          dictList.append(dTemp)
      self.response.out.write(json.dumps(dictList))
       
 
class s5(webapp2.RequestHandler):
  def get(self, sID=None):
    if sID:
      revList= Review.query()
      dictList = []; 
      for obj in revList:
        if obj.ShopID == sID:          
          dTemp =obj.to_dict();
          sKey=ndb.Key(urlsafe=obj.ShopID)
          sTemp=sKey.get()
          dTemp['ShopName'] = sTemp.Name;
          cKey=ndb.Key(urlsafe=obj.CheeseID)
          cTemp=cKey.get()
          dTemp['CheeseName'] = cTemp.Name;
          uKey=ndb.Key(urlsafe=obj.UserID)
          uTemp=uKey.get()
          dTemp['UserName'] = uTemp.DisplayName;
          dictList.append(dTemp)
      self.response.out.write(json.dumps(dictList))
       
 
class u5(webapp2.RequestHandler):
  def get(self, uID=None):
    if uID:
      revList= Review.query()
      dictList = []; 
      for obj in revList:
        if obj.UserID == uID:          
          dTemp =obj.to_dict();
          sKey=ndb.Key(urlsafe=obj.ShopID)
          sTemp=sKey.get()
          dTemp['ShopName'] = sTemp.Name;
          cKey=ndb.Key(urlsafe=obj.CheeseID)
          cTemp=cKey.get()
          dTemp['CheeseName'] = cTemp.Name;
          uKey=ndb.Key(urlsafe=obj.UserID)
          uTemp=uKey.get()
          dTemp['UserName'] = uTemp.DisplayName;
          dictList.append(dTemp)
      self.response.out.write(json.dumps(dictList))
        
class m5(webapp2.RequestHandler):
  def get(self, mID=None):
    if mID:
      cheeseList= Cheese.query()
      revList= Review.query()
      dictList = [];
      outList =[];
      for obj in cheeseList:
        if obj.MakerID == mID:          
          dictList.append(obj)
      for obj in dictList:
        for item in revList:
          if (item.CheeseID == obj.Id):
	    dTemp =item.to_dict();
            sKey=ndb.Key(urlsafe=item.ShopID)
            sTemp=sKey.get()
            dTemp['ShopName'] = sTemp.Name;
            cKey=ndb.Key(urlsafe=item.CheeseID)
            cTemp=cKey.get()
            dTemp['CheeseName'] = cTemp.Name;
            uKey=ndb.Key(urlsafe=item.UserID)
            uTemp=uKey.get()
            dTemp['UserName'] = uTemp.DisplayName;
            outList.append(dTemp)
            
      self.response.out.write(json.dumps(outList))
       
        

allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods
application = webapp2.WSGIApplication([
  ('/cheeses',c1),
  ('/cheesemakers',m1),
  ('/cheeseshops',s1),
  ('/users',u1),
  ('/cheeses/create',c3),
  ('/cheeseshops/create',s3),
  ('/cheesemakers/create',m3),
  ('/users/create',u3),
  ('/reviews/create',r3),
  ('/cheeses/(.*)/edit',c4),
  ('/cheeseshops/(.*)/edit',s4),
  ('/cheesemakers/(.*)/edit',m4),
  ('/users/(.*)/edit',u4),
  ('/reviews/(.*)/edit',r4),
  ('/cheeses/(.*)/reviews',c5),
  ('/cheeseshops/(.*)/reviews',s5),
  ('/cheesemakers/(.*)/reviews',m5),
  ('/users/(.*)/reviews',u5),
  ('/cheeses/(.*)',c2),
  ('/cheeseshops/(.*)',s2),
  ('/cheesemakers/(.*)',m2),
  ('/users/(.*)',u2)
], debug=True)
                       
