# Controller for Cheeses
from webob import Request, Response
from webob import exc
from webob.dec import wsgify
import re

class Cheese():

	def index(self):
		return 'This is the index for cheeses'

	def get(self, cheese_id):
		return 'Cheese number %s' % cheese_id

@wsgify
def app(req):
	cheese = Cheese()
	regex = re.compile('/cheese/\d')
	if (req.path == '/cheeses'):
		resp = Response(body=cheese.index())
	elif (re.match(regex, req.path)):
		object_id = re.findall("[0-9]+", req.path)[-1]
		resp = Response(body=cheese.get(object_id))
	else:
		resp = Response(body='not found')
	return resp