class ErrorController < ApplicationController
  get '/error/access/:error_number' do
    error_number = params[:error_number]
    error = {}
    status = 404
    case error_number
    when '404'
      error = {
        :number => 404,
        :message => 'Archivo no encontrado',
        :description => 'La página que busca no se encuentra en el servidor',
        :icon => 'fa fa-exclamation-triangle'
      }
      status = 404
    when '501'
      error = {
        :number => 501,
        :message => 'Página en Contrucción',
        :description => 'Lamentamos el incoveniente, estamos trabajando en ello.',
        :icon => 'fa fa-code-fork'
      }
      status = 500
    when '505'
      error = {
        :number => 505, :message => 'Acceso restringido',
        :description => 'Necesita estar logueado.',
        :icon => 'fa fa-ban'
      }
      status = 501
    when '8080'
      error = {
        :number => 8080, :message => 'Tiempo de la sesion agotado',
        :description => 'Vuelva a ingresar al sistema.',
        :icon => 'fa fa-clock-o'
      }
      status = 502
    else
      error = {
        :number => 404,
        :message => 'Archivo no encontrado',
        :description => 'La página que busca no se encuentra en el servidor',
        :icon => 'fa fa-exclamation-triangle'
      }
      status = 404
    end
    locals = {
      :csss => ErrorHelper::access_css(settings.constants),
      :jss => ErrorHelper::access_js(settings.constants),
      :error => error,
      :title => 'Error',
    }
    status status
    erb :'error/access', :layout => :'layouts/blank', :locals => locals
  end
end