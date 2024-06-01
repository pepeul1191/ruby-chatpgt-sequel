require 'openai_chatgpt'
require 'dotenv/load'

module Helpers
  module ChatHelper
    extend self
    def ask_chatgpt2(question)
      resp = {
        status: 'error',
        message: '',
        data: '',
        query: '',
      }
      begin
        querys = [
          'SELECT * FROM members;',
          %{
            SELECT members.id, members.names, members.last_names, levels.name as level_name 
            FROM members 
            INNER JOIN levels ON members.level_id = levels.id;
          %},
          %{
            SELECT members.*, levels.name AS level_name 
            FROM members 
            JOIN levels ON members.level_id = levels.id 
            WHERE members.names LIKE 'G%';            
          %},
          %{
            SELECT 
            exercises.name AS exercise_name,
            body_parts.name AS body_part,
            exercises_members.sets AS sets,
            exercises_members.reps AS reps
            FROM 
                members
            INNER JOIN 
                exercises_members ON members.id = exercises_members.member_id
            INNER JOIN 
                exercises ON exercises_members.exercise_id = exercises.id
            INNER JOIN 
                body_parts ON exercises.body_part_id = body_parts.id
            WHERE 
                members.names = 'GIL VELARDE'  
          %},
          'SELECT * FROM members WHERE id = 10000;', # no result set
        ]
        query = querys.sample
        rs = DB[query]
        # puts "Query: \n\t#{query}"
        # check if query return data
        resp[:status] = 'success'
        resp[:data] = {
          columns: rs.map(&:keys).flatten.uniq,
          result_set: []
        }
        resp[:query] = query
        # puts "Resultado: \n"
        rs.each do |row|
          # puts "\t#{row}"
          resp[:data][:result_set].push(row)
        end
        resp[:message] = 'Consulta exitosa'
      rescue OpenaiChatgpt::Error => e
        puts e.message
        resp[:status] = 'error'
        resp[:message] = 'Ocurrió un error al procesar su pregunta',
        resp[:data] = e.message
      rescue Sequel::DatabaseError => e
        puts e.message
        resp[:status] = 'error'
        resp[:message] = 'Ocurrió un error al ejercutar su consulta con la base de datos',
        resp[:data] = e.message
      end
      return resp
    end

    def ask_chatgpt(question)
      resp = {
        status: 'error',
        message: '',
        data: '',
        query: '',
      }
      # put chatgpt in context using the db schema
      db_schema = ''
      File.open(File.expand_path('../../../db/schema.sql', __FILE__), 'r') do |file|
        db_schema = file.read
      end
      db_schema = db_schema + '\n en base al esquema anterior, cual sería la consulta sql para la siguiente pregunta: \n'
      # do question to chatgpt
      client = OpenaiChatgpt::Client.new(api_key: ENV['OPENAI_API_KEY'])
      input_message = "#{db_schema}\n#{question}"
      begin
        response = client.completions(messages: [{role: "user", content: input_message}])
        response.results.each do |result|
          puts result.content
          sql = result.content.match(/SELECT.*?;/im)
          if sql
            # puts sql[0] # Imprime el SQL encontrado
            query = sql[0]
            rs = DB[query]
            # puts "Query: \n\t#{query}"
            # check if query return data
            resp[:status] = 'success'
            resp[:data] = {
              columns: rs.map(&:keys).flatten.uniq,
              result_set: []
            }
            resp[:query] = query
            # puts "Resultado: \n"
            rs.each do |row|
              # puts "\t#{row}"
              resp[:data][:result_set].push(row)
            end
            resp[:message] = 'Consulta exitosa'
          else
            # puts 'No se encontró ninguna consulta SQL en la cadena'
            resp[:message] = 'No se encontró ninguna consulta SQL en la cadena'
          end
        end
      rescue OpenaiChatgpt::Error => e
        puts e.message
        resp[:status] = 'error'
        resp[:message] = 'Ocurrió un error al procesar su pregunta',
        resp[:data] = e.message
      rescue Sequel::DatabaseError => e
        puts e.message
        resp[:status] = 'error'
        resp[:message] = 'Ocurrió un error al ejercutar su consulta con la base de datos',
        resp[:data] = e.message
      end
      return resp
    end
  end
end