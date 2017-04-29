import jinja2
import webapp2
import os

# Configuration
PROJECTNAME = "Cheese Diary"

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class MainPage(webapp2.RequestHandler):
    def get(self):

        template_values = {
            'projectName': PROJECTNAME,
        }

        template = JINJA_ENVIRONMENT.get_template('templates/dashboard.html')
        self.response.write(template.render(template_values))

app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
