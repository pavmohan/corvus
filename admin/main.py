import jinja2
import webapp2
import os

# Configuration ---------------------------------------------------------------
PROJECTNAME = "Cheese Diary"
DASHBOARD_PATH = "/dashboard"
REPORTS_PATH = "/reports"
ANALYTICS_PATH = "/analytics"
EXPORT_PATH = "/export"
CHEESES_PATH = "/cheeses"
CHEESEMAKERS_PATH = "/cheesemakers"
CHEESESHOPS_PATH = "/cheeseshops"
USERS_PATH = "/users"
ADMINISTRATORS_PATH ="/administrators"
MYACCOUNT_PATH = "/myaccount"
LOGOUT_PATH = "/logout"
# -----------------------------------------------------------------------------

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.write("Hello")

class DashboardPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/dashboard.html')
        self.response.write(template.render(setTemplateValues()))

class ReportsPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/reports.html')
        self.response.write(template.render(setTemplateValues()))

class AnalyticsPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/analytics.html')
        self.response.write(template.render(setTemplateValues()))

class ExportPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/export.html')
        self.response.write(template.render(setTemplateValues()))

class CheesesPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/cheeses.html')
        self.response.write(template.render(setTemplateValues()))

class CheesemakersPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/cheesemakers.html')
        self.response.write(template.render(setTemplateValues()))

class CheeseshopsPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/cheeseshops.html')
        self.response.write(template.render(setTemplateValues()))

class UsersPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/users.html')
        self.response.write(template.render(setTemplateValues()))

class AdministratorsPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/administrators.html')
        self.response.write(template.render(setTemplateValues()))

class MyAccountPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/myaccount.html')
        self.response.write(template.render(setTemplateValues()))

class LogoutPage(webapp2.RequestHandler):
    def get(self):
        self.response.write("Logout Page")

app = webapp2.WSGIApplication([
    ('/', MainPage),
    (DASHBOARD_PATH, DashboardPage),
    (REPORTS_PATH, ReportsPage),
    (ANALYTICS_PATH, AnalyticsPage),
    (EXPORT_PATH, ExportPage),
    (CHEESES_PATH, CheesesPage),
    (CHEESEMAKERS_PATH, CheesemakersPage),
    (CHEESESHOPS_PATH, CheeseshopsPage),
    (USERS_PATH, UsersPage),
    (ADMINISTRATORS_PATH, AdministratorsPage),
    (MYACCOUNT_PATH, MyAccountPage),
    (LOGOUT_PATH, LogoutPage),
], debug=True)

def setTemplateValues():
    template_values = {
        'projectName': PROJECTNAME,
        'dashboardPath': DASHBOARD_PATH,
        'reportsPath': REPORTS_PATH,
        'analyticsPath': ANALYTICS_PATH,
        'exportPath': EXPORT_PATH,
        'cheesesPath': CHEESES_PATH,
        'cheesemakersPath': CHEESEMAKERS_PATH,
        'cheeseshopsPath': CHEESESHOPS_PATH,
        'usersPath': USERS_PATH,
        'administratorsPath': ADMINISTRATORS_PATH,
        'myAccountPath': MYACCOUNT_PATH,
        'logoutPath': LOGOUT_PATH,
    }

    return template_values
