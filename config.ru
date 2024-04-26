require_relative 'config/environment.rb'

use ErrorController
use HomeController
use LoginController
use ChatController

"""
controllers_folder = File.expand_path('app/controllers', __dir__)

Dir.glob(File.join(controllers_folder, '*.rb')).each do |file|
  require file
end
"""

run ApplicationController