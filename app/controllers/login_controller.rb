class LoginController < ApplicationController
  [
    '/login',
    '/sign-in',
    '/reset-password',
    '/new-password/success'
  ].each do |path|
    before path do
      puts 'before'
      puts check_session_true
    end
  end

  before '/login' do
    puts 'before2'
  end

  [ 
    '/login',
    '/sign-in',
    '/reset-password',
    '/new-password/success'
  ].each do |path|
    get path do
      locals = {
        :title => 'Login',
      }
      erb :'login', :layout => false, :locals => locals
    end
  end
end
