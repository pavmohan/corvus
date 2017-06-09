import datetime
import urllib
import wsgiref.handlers
import json
from google.appengine.ext import ndb
import webapp2
import webapp2_extras



class Cheese(ndb.Model):
  id=ndb.StringProperty()
  name=ndb.StringProperty()
  maker_id=ndb.StringProperty()
 
class CheeseShop(ndb.Model):
  id=ndb.StringProperty()
  name=ndb.StringProperty()
  phone=ndb.StringProperty()
  street=ndb.StringProperty()
  city=ndb.StringProperty()
  state=ndb.StringProperty()
  country=ndb.StringProperty()
  zipcode=ndb.StringProperty()

class CheeseMaker(ndb.Model):
  id=ndb.StringProperty()
  name=ndb.StringProperty()
  location=ndb.StringProperty()

class User(ndb.Model):
  id=ndb.StringProperty()
  name=ndb.StringProperty()
  display_name=ndb.StringProperty()
  email=ndb.StringProperty()
  time_created=ndb.StringProperty()
  is_admin=ndb.BooleanProperty()  

class Review(ndb.Model):
  id=ndb.StringProperty()
  price_per_pound=ndb.IntegerProperty()
  tasting_notes=ndb.StringProperty()
  rating=ndb.IntegerProperty()
  photo=ndb.StringProperty()
  user_id=ndb.StringProperty()
  cheese_id=ndb.StringProperty()
  cheeseshop_id=ndb.StringProperty() 

class c1(webapp2.RequestHandler):
  def get(self):
    cheeseList = Cheese.query(); 
    dictList = []; 
    for obj in cheeseList:
      dTemp=obj.to_dict()
      mKey=ndb.Key(urlsafe=obj.maker_id)
      mTemp=mKey.get().to_dict()
      biTemp={}
      biTemp['cheese'] = dTemp;
      biTemp['cheesemaker'] = mTemp;
      dictList.append(biTemp)
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
      mKey=ndb.Key(urlsafe=tempCheese.maker_id)
      mTemp=mKey.get().to_dict()
      biTemp={}
      biTemp['cheese'] = dTemp;
      biTemp['cheesemaker'] = mTemp;
      self.response.status=200;
      self.response.out.write(json.dumps(biTemp))


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
      
      sKey=ndb.Key(urlsafe=obj.shop_id)
      sTemp=sKey.get()
      dTemp['cheeseshop_name'] = sTemp.name;

      cKey=ndb.Key(urlsafe=obj.cheese_id)
      cTemp=cKey.get()
      dTemp['cheese_name'] = cTemp.name;

      uKey=ndb.Key(urlsafe=obj.user_id)
      uTemp=uKey.get()
      dTemp['display_name'] = uTemp.display_name;

      self.response.out.write(json.dumps(dTemp))



      
class c3(webapp2.RequestHandler):
  def post(self): 
    newCheese = json.loads(self.request.body)
    cheeseObj = Cheese();
    cheeseObj.name=newCheese['name']
    cheeseObj.maker_id=newCheese['maker_id']
    cKey=cheeseObj.put()
    cheeseObj.id = cKey.urlsafe()
    cheeseObj.put()
    dTemp = cheeseObj.to_dict()
    mKey=ndb.Key(urlsafe=cheeseObj.maker_id)
    mTemp=mKey.get()
    dTemp['maker_name'] = mTemp.name;

    self.response.write(json.dumps(dTemp))
      
class s3(webapp2.RequestHandler):
  def post(self): 
    newCheeseShop = json.loads(self.request.body)
    cheeseShopObj = CheeseShop();
    cheeseShopObj.name=newCheeseShop['name']
    cheeseShopObj.phone=newCheeseShop['phone']
    cheeseShopObj.street=newCheeseShop['street']
    cheeseShopObj.city=newCheeseShop['city']
    cheeseShopObj.state=newCheeseShop['state']
    cheeseShopObj.country=newCheeseShop['country']
    cheeseShopObj.zipcode=newCheeseShop['zipcode']
    sKey=cheeseShopObj.put()
    cheeseShopObj.id = sKey.urlsafe()
    cheeseShopObj.put()
    self.response.write(json.dumps(cheeseShopObj.to_dict()))

      
class m3(webapp2.RequestHandler):
  def post(self): 
    newCheeseMaker = json.loads(self.request.body)
    cheeseMakerObj = CheeseMaker();
    cheeseMakerObj.name=newCheeseMaker['name']
    cheeseMakerObj.location=newCheeseMaker['location']
    mKey=cheeseMakerObj.put()
    cheeseMakerObj.id = mKey.urlsafe()
    cheeseMakerObj.put()
    self.response.write(json.dumps(cheeseMakerObj.to_dict()))


      
class u3(webapp2.RequestHandler):
  def post(self): 
    newUser = json.loads(self.request.body)
    UserObj = User();
    UserObj.name=newUser['name']
    UserObj.display_name=newUser['display_name']
    UserObj.email=newUser['email']
    UserObj.time_created=None
    UserObj.is_admin=False
    value = "0"
    if UserObj.is_admin:
      value = "1"     
    uKey=UserObj.put()
    UserObj.id = uKey.urlsafe()
    UserObj.put()
    self.response.set_cookie('CheeseDiary_token', UserObj.id, max_age=2147483647, domain='static-pottery-164109.appspot.com', secure=True)
    self.response.set_cookie('CheeseDiary_isAdmin', value, max_age=2147483647 , domain='static-pottery-164109.appspot.com', secure=True)
    self.response.write(json.dumps(UserObj.to_dict()))


      
class r3(webapp2.RequestHandler):
  def post(self): 
    newRev = json.loads(self.request.body)
    revObj = Review();
    revObj.rating=newRev['rating']
    revObj.price_per_pound=newRev['price_per_pound']   
    revObj.tasting_notes=newRev['tasting_notes']
    revObj.photo=newRev['photo']
    revObj.cheese_id=newRev['cheese_id']
    revObj.cheeseshop_id=newRev['cheeseshop_id']
    revObj.user_id=newRev['user_id']
    rKey=revObj.put()
    revObj.id = rKey.urlsafe()
    revObj.put()

    dTemp = revObj.to_dict();
    sKey=ndb.Key(urlsafe=revObj.cheeseshop_id)
    sTemp=sKey.get()
    dTemp['cheeseshop_name'] = sTemp.name;

    cKey=ndb.Key(urlsafe=revObj.cheese_id)
    cTemp=cKey.get()
    dTemp['cheese_name'] = cTemp.name;

    uKey=ndb.Key(urlsafe=revObj.user_id)
    uTemp=uKey.get()
    dTemp['display_name'] = uTemp.display_name;

    self.response.write(json.dumps(dTemp))



class c4(webapp2.RequestHandler):
  def put(self,cID=None):
    if cID:
      newCheese = json.loads(self.request.body);
      cKey = ndb.Key(urlsafe=cID);
      tempCheese = cKey.get()
      if newCheese.has_key('name'):
        tempCheese.name = newCheese['name']
      if newCheese.has_key('maker_id'):
        tempCheese.maker_id = newCheese['maker_id']
      tempCheese.put()
      self.response.out.write(json.dumps(tempCheese.to_dict()))

class m4(webapp2.RequestHandler):
  def put(self,mID=None):
    if mID:
      newCheeseMaker = json.loads(self.request.body);
      mKey = ndb.Key(urlsafe=mID);
      tempCheeseMaker = mKey.get()
      if newCheeseMaker.has_key('name'):
        tempCheeseMaker.name = newCheeseMaker['name']
      if newCheeseMaker.has_key('location'):
        tempCheeseMaker.location = newCheeseMaker['location']
      tempCheeseMaker.put()
      self.response.out.write(json.dumps(tempCheeseMaker.to_dict()))


class s4(webapp2.RequestHandler):
  def put(self,sID=None):
    if sID:
      newCheeseShop = json.loads(self.request.body);
      sKey = ndb.Key(urlsafe=sID);
      tempCheeseShop = sKey.get()
      if newCheeseShop.has_key('name'):
        tempCheeseShop.name = newCheeseShop['name']
      if newCheeseShop.has_key('street'):
        tempCheeseShop.street = newCheeseShop['street']
      if newCheeseShop.has_key('city'):
        tempCheeseShop.city = newCheeseShop['city']
      if newCheeseShop.has_key('state'):
        tempCheeseShop.state = newCheeseShop['state']
      if newCheeseShop.has_key('zipcode'):
        tempCheeseShop.zipcode = newCheeseShop['zipcode']
      if newCheeseShop.has_key('phone'):
        tempCheeseShop.phone = newCheeseShop['phone']
      tempCheeseShop.put()
      self.response.out.write(json.dumps(tempCheeseShop.to_dict()))

class u4(webapp2.RequestHandler):
  def put(self,uID=None):
    if uID:
      newUser = json.loads(self.request.body);
      uKey = ndb.Key(urlsafe=uID);
      tempUser = uKey.get()
      if newUser.has_key('name'):
        tempUser.name = newUser['name']
      if newUser.has_key('display_name'):
        tempUser.display_name = newUser['display_name']
      if newUser.has_key('time_created'):
        tempUser.time_created = newUser['time_created']
      if newUser.has_key('email'):
        tempUser.email = newUser['email']
      if newUser.has_key('is_admin'):
        tempUser.is_admin = newUser['is_admin']
      tempUser.put()
      self.response.out.write(json.dumps(tempUser.to_dict()))


class r4(webapp2.RequestHandler):
  def put(self,rID=None):
    if rID:
      newRev = json.loads(self.request.body);
      rKey = ndb.Key(urlsafe=rID);
      tempRev = rKey.get()
      if newRev.has_key('rating'):
        tempRev.rating = newRev['rating']
      if newRev.has_key('price_per_pound'):
        tempRev.price_per_pound = newRev['price_per_pound']
      if newRev.has_key('tasting_notes'):
        tempRev.tasting_notes = newRev['tasting_notes']
      if newRev.has_key('photo'):
        tempRev.photo = newRev['photo']
      if newRev.has_key('cheese_id'):
        tempRev.cheese_id = newRev['cheese_id']
      if newRev.has_key('cheeseshop_id'):
        tempRev.cheeseshop_id = newRev['cheeseshop_id']
      if newRev.has_key('user_id'):
        tempRev.user_id = newRev['user_id']
      tempRev.put()
      self.response.out.write(json.dumps(tempRev.to_dict()))



class c5(webapp2.RequestHandler):
  def get(self, cID=None):
    if cID:
      revList= Review.query()
      dictList = []; 
      for obj in revList:
        if obj.cheese_id == cID:
	  dTemp =obj.to_dict();
          sKey=ndb.Key(urlsafe=obj.cheeseshop_id)
          sTemp=sKey.get()
          dTemp['cheeseshop_name'] = sTemp.name;

          cKey=ndb.Key(urlsafe=obj.cheese_id)
          cTemp=cKey.get()
          dTemp['cheese_name'] = cTemp.name;

          uKey=ndb.Key(urlsafe=obj.user_id)
          uTemp=uKey.get()
          dTemp['display_name'] = uTemp.display_name;                    
          dictList.append(dTemp)
      self.response.out.write(json.dumps(dictList))
       
 
class s5(webapp2.RequestHandler):
  def get(self, sID=None):
    if sID:
      revList= Review.query()
      dictList = []; 
      for obj in revList:
        if obj.cheeseshop_id == sID:          
          dTemp =obj.to_dict();
          sKey=ndb.Key(urlsafe=obj.cheeseshop_id)
          sTemp=sKey.get()
          dTemp['cheeseshop_name'] = sTemp.name;
          cKey=ndb.Key(urlsafe=obj.cheese_id)
          cTemp=cKey.get()
          dTemp['cheese_name'] = cTemp.name;
          uKey=ndb.Key(urlsafe=obj.user_id)
          uTemp=uKey.get()
          dTemp['display_name'] = uTemp.display_name;
          dictList.append(dTemp)
      self.response.out.write(json.dumps(dictList))
       
 
class u5(webapp2.RequestHandler):
  def get(self, uID=None):
    if uID:
      revList= Review.query()
      dictList = []; 
      for obj in revList:
        if obj.user_id == uID:          
          dTemp =obj.to_dict();
          sKey=ndb.Key(urlsafe=obj.cheeseshop_id)
          sTemp=sKey.get()
          dTemp['cheeseshop_name'] = sTemp.name;
          cKey=ndb.Key(urlsafe=obj.cheese_id)
          cTemp=cKey.get()
          dTemp['cheese_name'] = cTemp.name;
          uKey=ndb.Key(urlsafe=obj.user_id)
          uTemp=uKey.get()
          dTemp['display_name'] = uTemp.display_name;
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
        if obj.maker_id == mID:          
          dictList.append(obj)
      for obj in dictList:
        for item in revList:
          if (item.cheese_id == obj.id):
	    dTemp =item.to_dict();
            sKey=ndb.Key(urlsafe=item.cheeseshop_id)
            sTemp=sKey.get()
            dTemp['cheeseshop_name'] = sTemp.name;
            cKey=ndb.Key(urlsafe=item.cheese_id)
            cTemp=cKey.get()
            dTemp['cheese_name'] = cTemp.name;
            uKey=ndb.Key(urlsafe=item.user_id)
            uTemp=uKey.get()
            dTemp['display_name'] = uTemp.display_name;
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
                       
