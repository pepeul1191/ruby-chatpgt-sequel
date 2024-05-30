require 'mongo'
require 'mongoid'
# sql db
Sequel::Model.plugin :json_serializer
DB = Sequel.connect('sqlite://db/app.db')
# mongo db
CHAT = Mongo::Client.new('mongodb://127.0.0.1:27017/chat')

Mongoid.load!('./config/database.yml', :development)