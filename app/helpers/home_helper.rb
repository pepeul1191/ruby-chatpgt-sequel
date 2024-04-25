module Helpers
  module HomeHelper
    extend self
    def index_css(constants)
      resp = []
      if constants[:static_env] == 'dev'
        resp = [
          'bower_components/bootstrap/dist/css/bootstrap.min',
          'bower_components/font-awesome/css/font-awesome.min',
          'assets/css/constants',
          'assets/css/styles',
        ]
      else
        resp = [
          'dist/home.min',
        ]
      end
      resp
    end

    def index_js(constants)
      resp = []
      if constants[:static_env] == 'dev'
        resp = [
          'bower_components/bootstrap/dist/js/bootstrap.min',
          'bower_components/font-awesome/js/font-awesome.min',
          'assets/js/constants',
          'assets/js/styles',
        ]
      else
        resp = [
          'dist/home.min',
        ]
      end
      resp
    end
  end
end