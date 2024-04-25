Sequel::Model.plugin :json_serializer
DB = Sequel.connect('sqlite://db/data.db')