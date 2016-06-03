class GamesController < ApplicationController
    before_action :set_game, only: [:show, :edit, :update, :check_turn?,
    :destroy, :bid, :challenge, :start_game, :end_game, :start_round, :end_round, :join]
    before_action :set_turn, only: [:bid]

  # GET /games
  # GET /games.json
  def index
    @games = Game.all
  end

  # GET /games/1
  # GET /games/1.json
  def show
    session[:game_id] = @game.id
    session[:game_name] = @game.name
  end

  # GET /games/new
  def new
    @game = Game.new
  end

  # GET /games/1/edit
  def edit
  end

  # POST /games
  # POST /games.json
  def create
    @game = Game.new(game_params)
    @game.owner = current_user.id
    @game.turn = current_user.id
    session[:game_id] = @game.id
    session[:game_name] = @game.name
    respond_to do |format|
      if @game.save
        format.html { redirect_to @game }
        format.json { render :show, status: :created, location: @game }
      else
        format.html { render :new }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /games/1
  # PATCH/PUT /games/1.json
  def update
    respond_to do |format|
      if @game.update(game_params)
        format.html { redirect_to @game, notice: 'Game was successfully updated.' }
        format.json { render :show, status: :ok, location: @game }
      else
        format.html { render :edit }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /games/1
  # DELETE /games/1.json
  def destroy
    @game.destroy
    respond_to do |format|
      format.html { redirect_to games_url, notice: 'Game was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  #join function to add users as they join the game
  #increment logged_in_users
  #if logged in == max, don't let anymore in, change game state to 1
  def join
    increment = {:logged_in_users => @game.logged_in_users+=1}
    if @game.logged_in_users < @game.max_users
      @game.update(increment);
      Pusher.trigger('chat_channel'+@game.id.to_s, 'chat_add', {:name => current_user.username})
      redirect_to @game
    end

    if @game.logged_in_users == @game.max_users
      @game.update({:state => 1});
      Pusher.trigger('chat_channel'+@game.id.to_s, 'chat_add', {:name => current_user.username})
      Pusher.trigger('game_channel'+@game.id.to_s, 'render_add', {:logged_in_users => @game.logged_in_users})
    end
    head :ok
  end

  #Checks if its the users turn
  def check_turn?
    #get game_params[:uid]
    #check if uid is at the top of the queue
    #if it is, return true
    #else return false
    game_params[:uid].to_i != @game.turn ? true : false
  end

  #Save bid into the database
  #Check if bid is valid
  #If valid, save
  #If not, return with prompt
  def bid
    bid_params = {
      :prev_player_id => game_params[:prev_player_id], 
      :turn => @turn,
      :quantity => game_params[:quantity],
      :value => game_params[:value]
    }

    if check_turn?
      respond_to do |format|
        test = {:status => "ok", :bad_response => "It is not your turn to bid"}
        format.json {render :json => test}
      end
    else
      if game_params[:quantity].to_i > @game.quantity.to_i || 
        game_params[:value].to_i > @game.value.to_i
        game_params[:turn] = @turn
        @game.update(bid_params)
        Pusher.trigger('game_channel'+@game.id.to_s, 'bid_event', bid_params)
        head :ok
      else
        respond_to do |format|
          test = {:status => "ok", :bad_response => "Your bid was not higher than the recent bid."}
          format.json {render :json => test}
        end
      end
    end
  end

  #Handle challenge
  #Check if bid is in the diepool
  #Use pusher to display results to everyone.
  #if true, that means challenger lost
  #if false, that means challengee lost (previous player)
  def challenge
    return_data = {:diepool => @game.diepool, :uname => game_params[:uname], 
      :uid => game_params[:uid]}
    total_quantity = 0
    @game.diepool.split(",").map do |str|
      str.to_i
    end.each do |die|
      total_quantity += 1 if @game.value == die
    end

    return_data[:result] = total_quantity >= @game.quantity ? true : false

    if check_turn?
      respond_to do |format|
        test = {:status => "ok", :bad_response => "It is not your turn to challenge"}
        format.json {render :json => test}
      end
    else
      if return_data[:result]
        game_user = GameUser.all.where("user_id = ? AND game_id = ?", 
          game_params[:uid], @game.id).first()
        new_quantity = game_user.dice_quantity - 1
        game_user.update({dice_quantity: new_quantity})
      else
        game_user = GameUser.all.where("user_id = ? AND game_id = ?", 
        @game.prev_player_id, @game.id).first()
        new_quantity = game_user.dice_quantity - 1
        game_user.update({dice_quantity: new_quantity})
        return_data[:uname] = User.find(game_user.user_id).username
      end
      lose_dice

      num_users_remaining = GameUser.where("game_id = ? AND dice_quantity > ?", session[:game_id], 0).count
      return_data[:num_users_remaining] = num_users_remaining

      Pusher.trigger('game_channel'+@game.id.to_s, 'challenge_event', return_data)
      head :ok
    end
  end

  def lose_dice
    #subtract 1 dice from the player who made the bid if they lied
    #else subtract 1 dice from the player who challenged them
    die_pool = @game.diepool[0...-2]
    deal_dice(shuffle_dice(die_pool))
  end

  def deal_dice(die_pool)
    #distribute dice to each game user
    #for each player, take there make dice from the die die_pool
    #for these add amount of dice to game_user
    users = GameUser.all.where(game_id: session[:game_id])
    users.each do |user|
      new_dice = die_pool[0...user.dice_quantity]
      user.update({:dice => new_dice.join(",")})
      die_pool.slice!(0...user.dice_quantity)
    end
  end

  def shuffle_dice(diepool)
    die_array = []
    len = diepool.split(",").length
    (1..len).each do |t|
      die_array.push(rand(1..6))
    end
    #update round here
    @game.update(:diepool => die_array.join(","))
    die_array
  end

  def generate_dice
    die_array = []
    (1..@game.logged_in_users*5).each do |t|
      die_array.push(rand(1..6))
    end
    @game.update({:diepool => die_array.join(",")})
    die_array
  end

  def start_game
    @game.update(game_params)
    deal_dice(self.generate_dice)
    Pusher.trigger('game_channel'+session[:game_id].to_s, 'render_game_start', game_params)
    head :ok
  end

  def start_round
    @game.update(game_params)
    response_hash = {
      :diepool => @game.diepool,
      :round => game_params[:round]
    }
    Pusher.trigger('game_channel'+session[:game_id].to_s, 'render_round_start', response_hash)
    head :ok
  end

  def end_game
    @game.update(game_params)
    Pusher.trigger('game_channel'+session[:game_id].to_s, 'render_game_end', game_params)
    head :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    def set_turn
      game_user_ids = GameUser.where("game_id = ? AND dice_quantity > ?", session[:game_id], 0).pluck("user_id").sort
      current_turn = @game.turn
      if game_user_ids.length == 1
        @turn = -1
      elsif game_user_ids.index(current_turn) == game_user_ids.index(game_user_ids.last)
        @turn = game_user_ids.first
      else
        @turn = game_user_ids[game_user_ids.index(current_turn)+1] 
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def game_params
      params.require(:game).permit(:name, :owner, :turn, :round, :max_users, :logged_in_users,
       :diepool, :state, :quantity, :value, :prev_player_id, :uid, :uname, :winner_id)
    end

    def switch_turns
      @queue = Array.new(@game.logged_in_users)
      @queue.fill(99)
      puts @queue
      # @queue.push(@queue.shift)
    end
end
