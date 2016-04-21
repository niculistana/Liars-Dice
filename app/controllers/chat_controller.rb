class ChatController < ApplicationController
  def message
    Pusher.trigger('chat_channel', 'chat', {name: current_user.username, message: params[:chatMessage]})

    head :ok
  end
end
