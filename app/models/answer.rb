require 'mongoid'

class Answer
  include Mongoid::Document
  field :query, type: String
  field :columns, type: Array, default: []
  field :result_set, type: Array, default: []
end