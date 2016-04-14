require 'test_helper'

class PagesControllerTest < ActionController::TestCase
  test "should get create" do
    get :create
    assert_response :success
  end

  test "should get join" do
    get :join
    assert_response :success
  end

  test "should get leaderboard" do
    get :leaderboard
    assert_response :success
  end

  test "should get spectate" do
    get :spectate
    assert_response :success
  end

end
