require 'mongoid'
require 'bson'
require_relative './answer'
require_relative './schema'

class Message
  include Mongoid::Document
  field :question, type: String
  field :error, type: String
  field :created_at, type: Time
  embeds_one :answer
  # belongs_to :schema
end