class ApplicationController < Sinatra::Base
  configure do
    set :views, 'app/views'
    enable :sessions
    set :session_secret, 'a33ac20e2af6b865a35b005c6c8df10e'
    set :layout, 'views/layouts'
    set :public_folder, File.dirname(__FILE__) + '/../../public'
    set :constants, CONSTANTS[:local]
  end

  before do
    headers['server'] = 'Ruby, Ubuntu'
  end

  helpers Helpers

  not_found do
    case request.env['REQUEST_METHOD']
    when 'GET'
      extensions = ['css', 'js', 'png', ]
      path = request.path.split('.')
      if !extensions.include? path[path.length - 1]
        redirect '/error/access/404' if request.path_info != "/error/access/404"
      end
    else
      status 404
      'Recurso no encontrado'
    end
  end

  def initialize(app = nil)
    super(app)
    puts "******** constructing myapp **********"
  end
end