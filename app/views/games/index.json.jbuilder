json.array!(@games) do |game|
  json.extract! game, :id, :name, :turn, :diepool, :state
  json.url game_url(game, format: :json)
end
