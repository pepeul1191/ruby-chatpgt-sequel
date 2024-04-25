module Helpers
  def css(csss, constants)
    static_url = constants[:static_url]
    resp = ''
    if defined? csss
      csss.each do |file|
        temp = '<link href="' + static_url + file + '.css" rel="stylesheet"/>'
        resp = resp + temp
      end
    end
    resp
  end

  def js(jss = nil, constants)
    static_url = constants[:static_url]
    resp = ''
    if jss != nil
      if defined? jss
        jss.each do |file|
          temp = '<script src="' + static_url + file + '.js" type="text/javascript"></script>'
          resp = resp + temp
        end
      end
    end
    resp
  end

  def check_session_true
    'check_session_true'
  end
end