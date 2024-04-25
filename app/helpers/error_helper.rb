module Helpers
  module ErrorHelper
    extend self
    def access_css(constants)
      resp = []
      if constants[:static_env] == 'dev'
        resp = [
          'bower_components/bootstrap/dist/css/bootstrap.min',
          'bower_components/font-awesome/css/font-awesome.min',
          'assets/css/constants',
          'assets/css/styles',
          'assets/css/error',
        ]
      else
        resp = [
          'dist/home.min',
        ]
      end
      resp
    end

    def access_js(constants)
      []
    end
  end
end