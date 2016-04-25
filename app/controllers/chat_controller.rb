class ChatController < ApplicationController
  def message
    Pusher.trigger('chat_channel'+session[:game_id].to_s, 'chat', {name: current_user.username, message: params[:chatMessage]})

    head :ok
  end

  #Need to take this out from chat_controller since this has to do with
  #game logic maybe
  def id
    respond_to do |format|
      id_message = {:status => "ok", :id => session[:game_id]}
      format.json {render :json => id_message}
    end
  end
end
