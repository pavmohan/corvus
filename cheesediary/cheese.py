# Controller for Cheeses

class Cheese(object):

	def __init__(self, req):
		self.request = req

	def get(self):
		return 'This is the index'

