require 'mongoid'
require_relative './message'

class Conversation
  include Mongoid::Document
  field :name, type: String
  field :created_at, type: Time
  field :updated_at, type: Time
  embeds_many :messages
  # belongs_to :user
end