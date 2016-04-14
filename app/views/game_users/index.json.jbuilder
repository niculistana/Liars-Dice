json.array!(@game_users) do |game_user|
  json.extract! game_user, :id, :game_id, :user_id, :dice
  json.url game_user_url(game_user, format: :json)
end
