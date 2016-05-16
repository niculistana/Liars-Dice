class GameUsersController < ApplicationController
  before_action :set_game_user, only: [:show, :edit, :update]

  # GET /game_users
  # GET /game_users.json
  def index
    @game_users = GameUser.all
  end

  # GET /game_users/1
  # GET /game_users/1.json
  def show
    @game_user = GameUser.find(params[:id])
    @params = params
  end

  # /game_users/1/user_username
  def user_username
    @game_user = GameUser.where({game_id: session[:game_id], user_id: params[:id]}).first
    @user = @game_user.user
    respond_to do |format|
      uname_message = {:status => "ok", :uname => @user.username}
      format.json {render :json => uname_message}
    end
  end

  # GET /game_users/new
  def new
    @game_user = GameUser.new
  end

  # GET /game_users/1/edit
  def edit
  end

  # POST /game_users
  # POST /game_users.json
  def create
    game_user_array = GameUser.where("game_id = ? AND user_id = ?", game_user_params[:game_id],
      game_user_params[:user_id])
    if game_user_array.empty?
      @game_user = GameUser.new(game_user_params)

      #Pusher.trigger('game_channel'+session[:game_id].to_s, 'render_add', game_user_params)
      respond_to do |format|
        if @game_user.save
          format.html { redirect_to @game_user }
          format.json { render :show, status: :created, location: @game_user }
        else
          format.html { render :new }
          format.json { render json: @game_user.errors, status: :unprocessable_entity }
        end
      end
    elsif game_user_array.length == 1
      total_user = GameUser.where("game_id = ?", game_user_params[:game_id])
      respond_to do |format|
        format.json {render json: {:response => "disconnect", :users_len => total_user.length}}
      end
    else
      respond_to do |format|
        format.json {render json: {:response => "fail"}}
      end
    end
  end

  # PATCH/PUT /game_users/1
  # PATCH/PUT /game_users/1.json
  def update
    respond_to do |format|
      if @game_user.update(game_user_params)
        format.html { redirect_to @game_user, notice: 'Game user was successfully updated.' }
        format.json { render :show, status: :ok, location: @game_user }
      else
        format.html { render :edit }
        format.json { render json: @game_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /game_users/1
  # DELETE /game_users/1.json
  def destroy
    Pusher.trigger('game_channel'+session[:game_id].to_s, 'render_delete', game_user_params)
    GameUser.destroy(GameUser.where({user_id: game_user_params[:user_id]}))
    respond_to do |format|
      format.html { redirect_to game_users_url, notice: 'Game user was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def show_dice
    game_user = GameUser.where({user_id: game_user_params[:user_id], 
      game_id: game_user_params[:game_id]}).first()
    respond_to do |format|
      format.json {render :json => {:hand => game_user.dice}}
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game_user
      @game_user = GameUser.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def game_user_params
      params.require(:game_user).permit(:game_id, :user_id, :dice, :is_ready)
    end
end
