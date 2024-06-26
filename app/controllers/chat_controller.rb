require 'json'

class ChatController < ApplicationController
  post '/chat/update-name' do
    resp = {
      status: 'error',
      message: '',
      data: '',
    }
    begin
      request_body = JSON.parse(request.body.read)
      conversation_id = request_body['_id']
      name = request_body['name']
      _id = BSON::ObjectId(conversation_id)      
      conversation = Conversation.find(_id)
      if conversation.nil?
        resp[:message] = 'No se encontró conversación'
        resp[:data] = nil
      else
        conversation.update(name: name)
      end
      resp[:status] = 'success'
    rescue => e
      puts e.message
      resp[:message] = 'Ocurrió un error al buscar la conversación',
      resp[:data] = e.message
    end
    resp.to_json
  end

  post '/chat/send-question' do
    # params
    request_body = JSON.parse(request.body.read)
    # procedure
    question = request_body['question']
    conversation_name = request_body['conversation_name']
    conversation_id = request_body['conversation_id']
    chatpgt_response = ChatHelper::ask_chatgpt(question)
    # new answer
    answer = Answer.new(
      query: chatpgt_response[:query],
      columns: chatpgt_response[:data][:columns].map(&:to_s),
      result_set: chatpgt_response[:data][:result_set],
    )
    # append answer to new message
    message_time = Time.now
    chatpgt_response[:time] = message_time
    message = Message.new(
      question: question,
      error: false,
      created_at: message_time,
    )
    message.answer = answer
      # puts message.errors.full_messages if message.errors.any?
    # create or update convesation with message
    _id = BSON::ObjectId(conversation_id)
    conversation = Conversation.find_by(id: _id)
    if conversation.nil? # create
      conversation = Conversation.new(
        _id: _id,
        name: conversation_name,
        created_at: Time.now,
        updated_at: Time.now
      )
      conversation.messages << message
      conversation.save
    else # update
      conversation.updated_at = Time.now
      # conversation.name = conversation_name
      conversation.messages = conversation.messages.to_a << message
      conversation.save
    end
    # CHAT[:conversations].insert_one(JSON.parse(response.to_json))
    # response
    chatpgt_response.to_json
  end

  get '/chat/list' do
    Conversation.fetch_resume.to_json
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
      conversation = Conversation.fetch_one(_id)
      if conversation.nil?
        resp[:message] = 'No se encontró conversación'
        resp[:data] = nil
      else
        resp[:message] = 'Conversación encontrada'
        resp[:data] = conversation
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
