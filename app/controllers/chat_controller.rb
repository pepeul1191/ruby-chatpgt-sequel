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
end
