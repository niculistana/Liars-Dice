class ChatController < ApplicationController
  def message
    #append to chat_channel +session[:game_id].to_s
    username = "";
    if current_user != nil
      username = current_user.username
    else
      username = "guest"
    end
    Pusher.trigger('chat_channel', 'chat', {name: username, 
      message: params[:chatMessage]})

    head :ok
  end
end
