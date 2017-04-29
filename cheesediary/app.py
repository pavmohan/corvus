from webob import Request, Response
from webob import exc

from cheese import Cheese

def controller(cls):
	def application(environ, start_response):
		req = Request(environ)
		try:
			instance = cls(req, **req.urlvars)
			action = req.urlvars.get('action')
			if action:
				action += '_' + req.method.lower()
			else:
				action = req.method.lower()
			try:
				method = getattr(instance, action)
			except AttributeError:
				raise exc.HTTPNotFound("No action %s" % action)
			resp = method()
			if isinstance(resp, basestring):
				resp = Response(body=resp)
		except exc.HTTPException, e:
			resp = e
		return resp(environ, start_response)
	return application


req = Request.blank('/')
app = req.get_response(controller(Cheese))