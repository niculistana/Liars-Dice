json.array!(@games) do |game|
  json.extract! game, :id, :name, :turn, :diepool, :completed
  json.url game_url(game, format: :json)
end
