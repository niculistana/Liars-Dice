require 'test_helper'

class GameUsersControllerTest < ActionController::TestCase
  setup do
    @game_user = game_users(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:game_users)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create game_user" do
    assert_difference('GameUser.count') do
      post :create, game_user: { dice: @game_user.dice, game_id: @game_user.game_id, user_id: @game_user.user_id }
    end

    assert_redirected_to game_user_path(assigns(:game_user))
  end

  test "should show game_user" do
    get :show, id: @game_user
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @game_user
    assert_response :success
  end

  test "should update game_user" do
    patch :update, id: @game_user, game_user: { dice: @game_user.dice, game_id: @game_user.game_id, user_id: @game_user.user_id }
    assert_redirected_to game_user_path(assigns(:game_user))
  end

  test "should destroy game_user" do
    assert_difference('GameUser.count', -1) do
      delete :destroy, id: @game_user
    end

    assert_redirected_to game_users_path
  end
end
