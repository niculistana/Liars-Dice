class SessionController < ApplicationController
  def name_id
    respond_to do |format|
      id_message = {:status => "ok", :id => session[:game_id], :name => session[:game_name]}
      format.json {render :json => id_message}
    end
  end
end