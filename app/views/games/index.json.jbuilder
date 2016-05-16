json.array!(@games) do |game|
  json.extract! game, :id, :name, :owner, :turn, :round, :diepool, :winner_id, :state
  json.url game_url(game, format: :json)
end
