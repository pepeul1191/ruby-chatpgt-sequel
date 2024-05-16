require 'mongoid'
require_relative './schema_version'
require_relative './message'

class Schema
  include Mongoid::Document
  field :name, type: String
  field :description, type: String
  field :connection_url, type: String
  field :created_at, type: Time
  field :updated_at, type: Time
  embeds_many :schema_version
  has_many :messages
end