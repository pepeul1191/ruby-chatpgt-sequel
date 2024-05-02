class HomeController < ApplicationController
  ['/', '/distritos', '/whatever'].each do |path|
    before path do
      puts 'before'
      puts check_session_true
    end
  end

  before '/' do
    puts 'before2'
  end

  [ 
    '/',
    '/about',
    '/conversation',
    '/conversation/:conversation_id',
    '/contact'
  ].each do |path|
    get path do
      locals = {
        :title => 'Bienvenido',
        :constants => settings.constants,
        :csss => HomeHelper::index_css(settings.constants),
        :jss => HomeHelper::index_js(settings.constants),
      }
      erb :'home/index', :layout => :'layouts/blank', :locals => locals
    end
  end

  get '/level/list' do
    Level.all.to_a.to_json
  end  
end
