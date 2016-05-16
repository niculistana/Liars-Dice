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

  # used for turn queue
  def game_user_ids
    turn_ids = GameUser.where({game_id: session[:game_id]}).pluck(:user_id).join(",")
    respond_to do |format|
      turn_message = {:status => "ok", :turn => turn_ids}
      format.json {render :json => turn_message}
    end
  end

  def game_winner_id
    game_winner_id = GameUser.where("game_id = ? AND dice_quantity > ?", session[:game_id], 0).first.user_id
    respond_to do |format|
      game_winner_message = {:status => "ok", :user_id => game_winner_id}
      format.json {render :json => game_winner_message}
    end
  end

  # current user's turn
  def game_turn_id
    turn_id = Game.find(session[:game_id]).turn
    respond_to do |format|
      turn_message = {:status => "ok", :turn => turn_id}
      format.json {render :json => turn_message}
    end
  end

  def recent_user
    @game_user = GameUser.where({game_id: session[:game_id]}).order(:updated_at).last
    respond_to do |format|
      id_message = {:status => "ok", :uid => @game_user.user_id, :uname => @game_user.user.username, :dice => @game_user.dice}
      format.json {render :json => id_message}
    end
  end

  def least_recent_user
    @game_user = GameUser.where({game_id: session[:game_id]}).order(:updated_at).first
    respond_to do |format|
      id_message = {:status => "ok", :uid => @game_user.user_id, :uname => @game_user.user.username, :dice => @game_user.dice}
      format.json {render :json => id_message}
    end
  end

  # used for displaying user that left the game/lobby
  def recent_user_name
    @user = User.find(params[:id])
    respond_to do |format|
      uname_message = {:status => "ok", :uname => @user.username}
      format.json {render :json => uname_message}
    end
  end
end