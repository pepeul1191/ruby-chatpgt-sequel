require 'net/smtp'
require 'base64'
require 'dotenv/load'

module Helpers
  module EmailHelper
    extend self
    def send_report(emails, attachment_path)
      # sender, password, recipient, subject, body, attachment_path
      sender = ENV['EMAIL_SENDER']
      password = ENV['EMAIL_PASSWORD']
      recipient = emails
      subject = 'Report UL Journey'
      body = 'Reporte adjunto'

      attachment_data = File.read(attachment_path)
      encoded_attachment = Base64.strict_encode64(attachment_data)

      boundary = 'boundary_string'

      message = <<~MESSAGE
        From: #{sender}
        To: #{recipient}
        Subject: #{subject}
        MIME-Version: 1.0
        Content-Type: multipart/mixed; boundary=#{boundary}

        --#{boundary}
        Content-Type: text/plain; charset=UTF-8
        Content-Transfer-Encoding: 7bit

        #{body}

        --#{boundary}
        Content-Type: application/octet-stream; name=#{File.basename(attachment_path)}
        Content-Disposition: attachment; filename=#{File.basename(attachment_path)}
        Content-Transfer-Encoding: base64

        #{encoded_attachment}

        --#{boundary}--
      MESSAGE

      smtp = Net::SMTP.new('mail.softweb.pe', 587) # Cambia smtp.example.com por tu servidor SMTP y el puerto correspondiente
      smtp.enable_starttls # Si el servidor requiere TLS
      smtp.start('softweb.pe', sender, password, :login) do |smtp|
        smtp.send_message(message, sender, recipient)
      end

      resp = {
        status: 'error',
        message: '',
        data: '',
        query: '',
      }
      begin
        puts 'TODO'
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