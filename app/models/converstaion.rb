require 'mongoid'
require_relative './message'

class Conversation
  include Mongoid::Document
  field :name, type: String
  field :created_at, type: Time
  field :updated_at, type: Time
  embeds_many :messages
  # belongs_to :user

  def self.fetch_resume
    pipeline = [
      {
        "$project": {
          "_id": { "$toString": "$_id" },
          "name": 1,
          "created_at": 1,
          "updated_at": 1,
          "num_messages": { "$size": "$messages" }
        }
      }
    ]
    self.collection.aggregate(pipeline)
  end
end