class UsersController < ApplicationController
   def index
     if current_user
      @user = current_user
      @game_users = GameUser.where(user_id: @user.id)
     else
       redirect_to new_user_session_path, notice: 'You are not logged in.'
     end
   end
end
