require 'json'

class ChatController < ApplicationController
  post '/chat/send-question' do
    # params
    request_body = JSON.parse(request.body.read)
    # procedure
    question = request_body['question']
    response = ChatHelper::ask_chatgpt(question)
    CHAT[:conversations].insert_one(JSON.parse(response.to_json))
    # response
    response.to_json
  end

  get '/chat/:conversation_id' do
    conversation_id = params['conversation_id']
    conversation_object_id = BSON::ObjectId.from_string(conversation_id)
    document = collection.find(_id: objectId)
    # Renderizar un mensaje de saludo con el nombre recibido
    "Hello, #{conversation_id}!"
  end
end
