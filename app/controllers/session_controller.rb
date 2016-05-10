class SessionController < ApplicationController
  def name_id
    respond_to do |format|
      id_message = {:status => "ok", :id => session[:game_id], :name => session[:game_name]}
      format.json {render :json => id_message}
    end
  end

  def user_id
    respond_to do |format|
      uid_message = {:status => "ok", :uid => current_user.id}
      format.json {render :json => uid_message}
    end
  end

  def user_username
    respond_to do |format|
      uname_message = {:status => "ok", :uname => current_user.username}
      format.json {render :json => uname_message}
    end
  end
end