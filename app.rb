require 'openai_chatgpt'
require 'dotenv/load'

client = OpenaiChatgpt::Client.new(api_key: ENV['OPENAI_API_KEY'])
message = 'y la de Venezuela?'

begin
  response = client.completions(messages: [{role: "user", content: message}])
  response.results.each do |result|
    puts result.content
  end
rescue OpenaiChatgpt::Error => e
  puts e.message
end