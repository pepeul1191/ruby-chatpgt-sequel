require 'openai_chatgpt'
require 'dotenv/load'

module Helpers
  module EmailHelper
    extend self
    def send_report()
      resp = {
        status: 'error',
        message: '',
        data: '',
        query: '',
      }
      begin
        puts '+++++++++++++++++++++++++++++++++++++++++++++'
      rescue => e
        puts e.message
        resp[:status] = 'error'
        resp[:message] = 'Ocurrió un error al enviar el reporte',
        resp[:data] = e.message
      end
      return resp
    end
  end
end