require 'bson'
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

  def self.fetch_one(_id) # (BSON::ObjectId) -> doc
    pipeline = [
      {
        "$match": {
          "_id": _id
        }
      },
      {
        "$project": {
          "_id": { "$toString": "$_id" },
          "name": 1,
          "created_at": 1,
          "updated_at": 1,
          "messages": {
            "$map": {
              "input": "$messages",
              "as": "message",
              "in": {
                "_id": { "$toString": "$$message._id" },
                "content": "$$message.content",
                "question": "$$message.question",
                "error": "$$message.error",
                "created_at": "$$message.created_at",
                "answer": {
                  "_id": { "$toString": "$$message.answer._id" },
                  "columns": "$$message.answer.columns",
                  "result_set": "$$message.answer.result_set"
                }
              }
            }
          }
        }
      }
    ]
    self.collection.aggregate(pipeline).first
  end
end