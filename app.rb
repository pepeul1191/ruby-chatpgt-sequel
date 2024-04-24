require 'openai_chatgpt'
require 'dotenv/load'
require 'sequel'

DB = Sequel.sqlite('app.db')

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
    # puts result.content
    sql = result.content.match(/SELECT.*?;/im)
    if sql
      # puts sql[0] # Imprime el SQL encontrado
      rs = DB[sql[0]]
      puts "Query: \n\n#{sql[0]}\n\nResultado: \n\n"
      rs.each do |row|
        puts "#{row.to_s}"
      end
    else
      puts "No se encontró ninguna consulta SQL en la cadena."
    end
  end
rescue OpenaiChatgpt::Error => e
  puts e.message
end

# cuales son los nombres de los ejercicios del miembro de id 1