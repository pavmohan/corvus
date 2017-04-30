from webob import Request, Response
from webob import exc
from webob.dec import wsgify

@wsgify
def app(req):
	resp = Response(body='index')
	return resp