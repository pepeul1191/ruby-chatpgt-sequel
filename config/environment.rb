require 'bundler'
require 'bundler/setup'
Bundler.require

require_all 'config/initializers'
require_all 'app/helpers'
require_all 'app/models'
require_all 'app/controllers'
