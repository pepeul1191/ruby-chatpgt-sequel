require 'json'

class ChatController < ApplicationController
  post '/chat/send-question' do
    # params
    request_body = JSON.parse(request.body.read)
    # procedure
    question = request_body['question']
    response = ChatHelper::ask_chatgpt(question)
    # response
    response.to_json
  end
end
