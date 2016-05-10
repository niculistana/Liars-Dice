class ChatController < ApplicationController
  $guest_name = ["Jack Sparrow", "Barbossa", "Davy Jones", "Will Turner", "Elizabeth Swann"]
  def message
    #append to chat_channel +session[:game_id].to_s
    username = "";
    if current_user != nil
      username = current_user.username
    else
      username = "Guest"
    end
    puts session[:game_id]
    Pusher.trigger('chat_channel'+session[:game_id].to_s, 'chat', {name: username, 
      message: params[:chatMessage]})

    head :ok
  end
end
