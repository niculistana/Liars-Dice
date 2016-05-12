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

  # def user_username
  #   respond_to do |format|
  #     uname_message = {:status => "ok", :uname => current_user.username}
  #     format.json {render :json => uname_message}
  #   end
  # end

  def recent_user
    @game_user = GameUser.where({game_id: session[:game_id]}).order(:updated_at).last
    respond_to do |format|
      id_message = {:status => "ok", :uid => @game_user.user_id, :uname => @game_user.user.username, :dice => @game_user.dice}
      format.json {render :json => id_message}
    end
  end

  def recent_user_name
    @user = User.find(params[:id])
    respond_to do |format|
      uname_message = {:status => "ok", :uname => @user.username}
      format.json {render :json => uname_message}
    end
  end
end