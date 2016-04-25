class SessionController < ApplicationController
  def id
    puts "Checking session"
    puts session
    respond_to do |format|
      id_message = {:status => "ok", :id => session[:game_id]}
      format.json {render :json => id_message}
    end
  end
end