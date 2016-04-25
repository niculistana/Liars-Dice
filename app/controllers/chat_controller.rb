class ChatController < ApplicationController
  def message
    #append to chat_channel +session[:game_id].to_s
    Pusher.trigger('chat_channel', 'chat', {name: current_user.username, 
      message: params[:chatMessage]})

    head :ok
  end
end
