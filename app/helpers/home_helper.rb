module Helpers
  module HomeHelper
    extend self
    def index_css(constants)
      resp = []
      if constants[:static_env] == 'dev'
        resp = [
          'dist/app',
        ]
      else
        resp = [
          'dist/app.min',
        ]
      end
      resp
    end

    def index_js(constants)
      resp = []
      if constants[:static_env] == 'dev'
        resp = [
          'dist/app',
        ]
      else
        resp = [
          'dist/app.min',
        ]
      end
      resp
    end
  end
end