require 'openai_chatgpt'
require 'dotenv/load'

db_schema = ''
File.open('schema.sql', 'r') do |file|
  # Lee todas las líneas del archivo y las asigna a una variable
  db_schema = file.read
end
db_schema = db_schema + '\n en base al esquema anterior, cual sería la consulta sql para la siguiente pregunta: \n'

client = OpenaiChatgpt::Client.new(api_key: ENV['OPENAI_API_KEY'])
puts 'Ingrese su consulta: '
query = gets.chomp
input_message = "#{db_schema}\n#{query}"

begin
  response = client.completions(messages: [{role: "user", content: input_message}])
  response.results.each do |result|
    sql = result.content.match(/SELECT.*?;/)
    # puts result.content
    if sql
      puts sql[0] # Imprime el SQL encontrado
    else
      puts "No se encontró ninguna consulta SQL en la cadena."
    end
  end
rescue OpenaiChatgpt::Error => e
  puts e.message
end