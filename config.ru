require_relative 'config/environment.rb'

use ErrorController
use HomeController
use LoginController

run ApplicationController