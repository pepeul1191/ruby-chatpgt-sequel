require 'mongo'
# sql db
Sequel::Model.plugin :json_serializer
DB = Sequel.connect('sqlite://db/data.db')
# mongo db
CHAT = Mongo::Client.new('mongodb://127.0.0.1:27017/chat')