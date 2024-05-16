require 'json'

class ChatController < ApplicationController
  post '/chat/send-question' do
    # params
    request_body = JSON.parse(request.body.read)
    # procedure
    question = request_body['question']
    conversation_id = request_body['conversation_id']
    chatpgt_response = ChatHelper::ask_chatgpt(question)
    puts chatpgt_response[:data][:columns].class
    # new answer
    answer = Answer.new(
      query: chatpgt_response[:query],
      columns: chatpgt_response[:data][:columns].map(&:to_s),
      result_set: chatpgt_response[:data][:result_set],
    )
    # append answer to new message
    message = Message.new(
      question: question,
      error: false,
      created_at: Time.now,
    )
    message.answer = answer
    message.save
    puts message.errors.full_messages if message.errors.any?
    # create or update convesation wieth message
    
    # CHAT[:conversations].insert_one(JSON.parse(response.to_json))
    # response
    chatpgt_response.to_json
  end

  get '/chat/:conversation_id' do
    resp = {
      status: 'error',
      message: '',
      data: '',
    }
    begin
      conversation_id = params['conversation_id']
      _id = BSON::ObjectId(conversation_id)
      document = CHAT[:conversations].find(_id: _id).first
      if document.nil?
        resp[:message] = 'No se encontró conversación'
        resp[:data] = nil
      else
        resp[:message] = 'Conversación encontrada'
        resp[:data] = document
      end
      resp[:status] = 'success'
    rescue => e
      puts e.message
      resp[:message] = 'Ocurrió un error al buscar la conversación',
      resp[:data] = e.message
    end
    resp.to_json
  end

  post '/chat/send-report' do
    file = params[:file]
    emails = params[:emails]

    filename = file[:filename]
    tempfile = file[:tempfile]

    File.open("./tmp/#{filename}", 'wb') do |f|
      f.write(tempfile.read)
    end
    attachment_path = "./tmp/#{filename}"
    EmailHelper::send_report(emails, attachment_path)

    puts filename
    puts tempfile.path()
    puts emails
    'XD'
  end
end
