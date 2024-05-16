require 'mongoid'

class SchemaVersion
  include Mongoid::Document
  field :name, type: String
  field :description, type: String
  field :file_uml, type: String
  field :plant_uml, type: String
  field :created_at, type: Time
end